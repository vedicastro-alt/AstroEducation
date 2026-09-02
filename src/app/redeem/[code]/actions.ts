"use server";

import { redirect } from "next/navigation";
import * as Sentry from "@sentry/nextjs";
import { markReportTier, saveReport, type SaveReportInput } from "@/lib/reports/store";
import { birthDetailsSchema, computeReportPayload } from "@/lib/reports/buildReport";
import { getVoucherByCode, redeemVoucher } from "@/lib/giftVouchers/store";

export interface RedeemFormState {
  status: "idle" | "error";
  error?: string;
}

export async function redeemGiftVoucherAction(
  code: string,
  _prevState: RedeemFormState,
  formData: FormData,
): Promise<RedeemFormState> {
  const voucher = await getVoucherByCode(code);
  if (!voucher || voucher.status !== "paid") {
    return {
      status: "error",
      error:
        voucher?.status === "redeemed"
          ? "This gift code has already been used."
          : "We couldn't find that gift code — please double-check it, or contact us for help.",
    };
  }

  const raw = {
    childName: formData.get("childName")?.toString() ?? "",
    dob: formData.get("dob")?.toString() ?? "",
    timeUnknown: formData.get("timeUnknown")?.toString(),
    birthTime: formData.get("birthTime")?.toString() ?? "",
    decisionFocus: formData.get("decisionFocus")?.toString() ?? "",
    placeLabel: formData.get("placeLabel")?.toString() ?? "",
    placeLat: formData.get("placeLat")?.toString() ?? "",
    placeLon: formData.get("placeLon")?.toString() ?? "",
  };

  const parsed = birthDetailsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  let saveInput: SaveReportInput;
  try {
    // Redeeming a gift voucher is, by definition, receiving a gift --
    // no separate checkbox needed here the way the free intake form has
    // one (that one is about framing a reading you're about to hand to
    // someone else; here, the parent filling this in *is* the recipient).
    saveInput = computeReportPayload(parsed.data, true);
  } catch (err) {
    console.error("redeemGiftVoucherAction: failed to compute chart", err);
    Sentry.captureException(err);
    return {
      status: "error",
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong while reading the chart. Please try again.",
    };
  }

  let reportId: string;
  try {
    reportId = await saveReport(saveInput);
    // Unlock immediately at the voucher's tier -- no Stripe involved,
    // this was already paid for by whoever sent the gift. Reuses the
    // voucher's own Stripe session id as the report's tier-unlock
    // record, since there's no new session for this step.
    await markReportTier(reportId, voucher.tier, `giftVoucher:${voucher.code}`);
  } catch (err) {
    console.error("redeemGiftVoucherAction: failed to save/unlock report", err);
    Sentry.captureException(err);
    return {
      status: "error",
      error: "We couldn't create this reading just now — please try again in a moment.",
    };
  }

  const claimed = await redeemVoucher(voucher.code, reportId);
  if (!claimed) {
    // Lost a race against a second redemption attempt for the same code
    // (e.g. a double-submit) -- the report we just created is real and
    // paid-for via markReportTier above, so still send them to it rather
    // than showing an error for something that actually succeeded.
    Sentry.captureMessage("redeemGiftVoucherAction: voucher already redeemed by the time we claimed it", {
      level: "warning",
      extra: { code: voucher.code, reportId },
    });
  }

  redirect(`/report/${reportId}`);
}
