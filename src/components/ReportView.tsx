"use client";

import { useMemo, useState } from "react";
import type { BirthChart } from "@/lib/astro/types";
import type { EducationInsights, LearningPathway } from "@/lib/education/types";
import type { GentleRemedy } from "@/lib/education/remedies";
import type { CareerDeepDiveItem } from "@/lib/education/careerDeepDive";
import type { ReportMeta, ReportTier } from "@/lib/reports/store";
import { PRICING_TIERS, UPGRADE_TO_PREMIUM_CENTS, formatCents, formatPrice } from "@/lib/pricing";
import { createCheckoutSessionAction } from "@/app/report/[id]/actions";
import { BookReader, type BookPage } from "./BookReader";
import { buildPathwayPages } from "./pathwayPages";
import { ChartWheel } from "./ChartWheel";
import { KundliChart } from "./KundliChart";
import { IconPattern } from "./IconPattern";
import { SectionHeading } from "./SectionHeading";
import { UnlockReveal } from "./UnlockReveal";
import { ReportFeedbackForm } from "./ReportFeedbackForm";
import {
  CheckIcon,
  MoonIcon,
  OrbitIcon,
  PrinterIcon,
  SparkleIcon,
  StarIcon,
  SproutIcon,
  TargetIcon,
} from "./icons";

interface Props {
  reportId: string;
  chart: BirthChart;
  insights: EducationInsights;
  pathway: LearningPathway | null;
  remedies: GentleRemedy[] | null;
  careerDeepDive: CareerDeepDiveItem[] | null;
  tier: ReportTier | null;
  meta: ReportMeta;
  initialPageId?: string;
  /** True exactly on the request that just unlocked this tier via a
   * fresh Stripe redirect -- see UnlockReveal. */
  justUnlocked?: boolean;
}

function formatDob(dob: string) {
  const d = new Date(dob + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

interface GiftDelivery {
  recipientEmail: string;
  recipientName: string;
  giftNote: string;
}

function TierCard({
  reportId,
  tierId,
  highlight,
  gift,
  giftIncomplete,
}: {
  reportId: string;
  tierId: "full" | "premium";
  highlight?: boolean;
  gift?: GiftDelivery;
  giftIncomplete?: boolean;
}) {
  const tier = PRICING_TIERS[tierId];
  return (
    <form
      action={createCheckoutSessionAction}
      className={`flex flex-col rounded-2xl border p-6 text-left ${
        highlight
          ? "border-accent-bright bg-white/10"
          : "border-white/15 bg-white/5"
      }`}
    >
      <input type="hidden" name="reportId" value={reportId} />
      <input type="hidden" name="tier" value={tierId} />
      {gift?.recipientEmail && (
        <>
          <input type="hidden" name="recipientEmail" value={gift.recipientEmail} />
          <input type="hidden" name="recipientName" value={gift.recipientName} />
          <input type="hidden" name="giftNote" value={gift.giftNote} />
        </>
      )}
      {highlight && (
        <span className="mb-2 inline-block w-fit rounded-sm bg-accent-bright px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-primary-dark">
          Most complete
        </span>
      )}
      <h3 className="font-serif text-lg font-semibold text-white">{tier.name}</h3>
      <p className="mt-1 text-2xl font-semibold text-accent-bright">
        {formatPrice(tier)}
      </p>
      <p className="mt-1 text-xs text-white/60">{tier.tagline}</p>
      <ul className="mt-4 flex-1 space-y-2">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-white/80">
            <CheckIcon className="mt-0.5 h-3.5 w-3.5 flex-none text-accent-bright" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        type="submit"
        disabled={giftIncomplete}
        className={`mt-5 rounded-sm px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${
          highlight
            ? "bg-accent-bright text-primary-dark"
            : "border border-white/25 text-white hover:bg-white/10"
        }`}
      >
        {giftIncomplete ? "Enter recipient's email above" : `Unlock ${tier.name}`}
      </button>
    </form>
  );
}

export function ReportView({
  reportId,
  chart,
  insights,
  pathway,
  remedies,
  careerDeepDive,
  tier,
  meta,
  initialPageId,
  justUnlocked,
}: Props) {
  // Gift-delivery at the point of purchase -- collected here, not on the
  // free intake form, since that's "where there is a purchase option"
  // (a chart/report already exists by this point). Separate from
  // meta.isGift, which only controls the reading's own cosmetic framing
  // text and is set earlier, on the free intake form.
  const [isGiftDelivery, setIsGiftDelivery] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [giftNote, setGiftNote] = useState("");

  const freePages: BookPage[] = useMemo(
    () => [
      {
        id: "cover",
        chapterLabel: "Cover",
        background: "bg-primary text-white",
        content: (
          <div className="relative flex min-h-[22rem] flex-col items-center justify-center text-center sm:min-h-[26rem]">
            <ChartWheel className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 text-white/10" />
            <ChartWheel className="pointer-events-none absolute -left-16 -bottom-10 h-56 w-56 text-white/5" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright">
              {meta.isGift
                ? `A gift of the stars, for ${insights.childName}`
                : `${insights.childName}'s learning reading`}
            </p>
            <p className="relative mt-2 text-sm text-white/60">
              Born {formatDob(meta.dob)} in {meta.placeLabel}
            </p>
            <h1 className="relative mx-auto mt-5 max-w-xl font-serif text-2xl font-semibold leading-snug sm:text-3xl">
              {insights.headline}
            </h1>
            {meta.timeUnknown && (
              <p className="relative mx-auto mt-5 max-w-md rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white/75">
                Birth time wasn&apos;t provided, so this reading uses a
                midday estimate. Everything ahead is still meaningful,
                though a couple of fine details may shift slightly with an
                exact time.
              </p>
            )}
          </div>
        ),
      },
      {
        id: "chart-glance",
        chapterLabel: "Their chart at a glance",
        content: (
          <div className="relative">
            <div className="text-primary">
              <IconPattern icon={OrbitIcon} />
            </div>
            <div className="relative">
              <h2 className="font-serif text-xl font-semibold text-primary-dark sm:text-2xl">
                Their chart, at a glance
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-[13rem_1fr]">
                <KundliChart chart={chart} className="mx-auto w-full max-w-[13rem] sm:mx-0" />
                <div className="flex flex-col gap-4">
                  <div className="rounded-md border border-border-soft bg-white/70 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Rising Sign · {meta.ascendant}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-foreground/80">
                      {insights.ascendantSummary}
                    </p>
                  </div>
                  <div className="rounded-md border border-border-soft bg-white/70 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Moon · {meta.moonSign} · {meta.moonNakshatra}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-foreground/80">
                      {insights.moonSummary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      ...(insights.specialCombinations.length > 0
        ? [
            {
              id: "special-combinations",
              chapterLabel: "A special chart combination",
              background: "bg-accent-soft",
              content: (
                <div className="relative">
                  <div className="text-accent">
                    <IconPattern icon={SparkleIcon} />
                  </div>
                  <div className="relative">
                    <SectionHeading icon={SparkleIcon}>
                      {insights.specialCombinations.length > 1
                        ? "Special chart combinations"
                        : "A special chart combination"}
                    </SectionHeading>
                    <p className="mt-1.5 pl-[42px] text-sm text-foreground/70">
                      Classical Vedic astrology names certain planetary
                      combinations specifically — {insights.childName}
                      &apos;s chart has{" "}
                      {insights.specialCombinations.length > 1 ? "a few" : "one"}{" "}
                      worth calling out. These read a fixed, named alignment,
                      not the graded strength score used elsewhere in this
                      reading — so a combination here can genuinely stand out
                      even where a related placement reads more measured in
                      another chapter. Not a contradiction, just a different,
                      older lens on the same chart.
                    </p>
                    <div className="mt-5 space-y-3">
                      {insights.specialCombinations.map((item) => (
                        <div key={item.id} className="rounded-md border border-white/80 bg-white/70 p-5">
                          <h3 className="font-serif text-base font-semibold text-primary-dark">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-6 text-foreground/80">{item.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            } satisfies BookPage,
          ]
        : []),
      {
        id: "strengths",
        chapterLabel: "Natural strengths",
        background: "bg-success-soft",
        content: (
          <div className="relative">
            <div className="text-success">
              <IconPattern icon={StarIcon} />
            </div>
            <div className="relative">
              <SectionHeading icon={StarIcon}>Natural strengths</SectionHeading>
              <div className="mt-5 space-y-3">
                {insights.strengths.map((item) => (
                  <div key={item.id} className="rounded-md border border-white/80 bg-white/70 p-5">
                    <h3 className="font-serif text-base font-semibold text-primary-dark">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-foreground/80">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "nurture",
        chapterLabel: "Areas to nurture",
        background: "bg-growth-soft",
        content: (
          <div className="relative">
            <div className="text-growth">
              <IconPattern icon={SproutIcon} />
            </div>
            <div className="relative">
              <SectionHeading icon={SproutIcon}>Areas to nurture</SectionHeading>
              <p className="mt-1.5 pl-[42px] text-sm text-foreground/70">
                Every child has some — these simply need a little more
                patience, not worry.
              </p>
              <div className="mt-5 space-y-3">
                {insights.growthAreas.map((item) => (
                  <div key={item.id} className="rounded-md border border-white/80 bg-white/70 p-5">
                    <h3 className="font-serif text-base font-semibold text-primary-dark">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-foreground/80">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "focus-areas",
        chapterLabel: "Recommended focus areas",
        content: (
          <div className="relative">
            <div className="text-accent">
              <IconPattern icon={TargetIcon} />
            </div>
            <div className="relative">
              <SectionHeading icon={TargetIcon}>Recommended focus areas</SectionHeading>
              <p className="mt-1.5 pl-[42px] text-sm text-muted">
                Based on this chart, these are promising places to focus early
                learning energy.
              </p>
              {tier ? (
                <div className="mt-5 flex flex-wrap items-center gap-2 rounded-md border border-border-soft bg-white/70 p-5">
                  {insights.focusAreas.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent"
                    >
                      {item.title}
                    </span>
                  ))}
                  <span className="ml-1 text-sm text-muted">
                    — the full reading ahead breaks this down subject by
                    subject, so you know exactly how to support{" "}
                    {insights.childName} as they grow into who they&apos;re
                    meant to be.
                  </span>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {insights.focusAreas.map((item, i) => (
                    <div key={item.id} className="rounded-md border border-border-soft bg-white/70 p-5">
                      <p className="text-xs font-semibold text-accent">Focus {i + 1}</p>
                      <h3 className="mt-1 font-serif text-base font-semibold text-primary-dark">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-foreground/80">{item.body}</p>
                      <p className="mt-2.5 rounded-lg bg-surface-raised px-3 py-2 text-xs text-muted">
                        {item.tip}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        id: "pricing",
        chapterLabel: "Choose a full reading",
        background: "bg-primary-dark text-white",
        content: (
          <div className="relative">
            <ChartWheel className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 text-white/5" />
            <div className="relative text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright">
                For {insights.childName}, with love
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl">
                {meta.isGift
                  ? `Give ${insights.childName} the full story.`
                  : "You already see how bright they are. Go deeper."}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/70">
                {meta.isGift
                  ? `A beautiful one-time gift: ${insights.childName}'s full learning story — the subjects that will light them up, the support they'll need along the way, and a gentle sense of where their gifts may lead. This page is yours to keep and share.`
                  : `The full reading is ${insights.childName}'s learning story — the subjects that will light them up, the support they'll need along the way, and a gentle sense of where their gifts may lead. A one-time reading, yours to keep for every year ahead — no subscription, no account.`}
              </p>
            </div>
            <div className="relative mt-6 rounded-md border border-white/15 bg-white/5 p-4 text-left">
              <label className="flex items-center gap-2 text-sm font-medium text-white">
                <input
                  type="checkbox"
                  checked={isGiftDelivery}
                  onChange={(e) => setIsGiftDelivery(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-white/40 accent-accent-bright"
                />
                Send this as a gift instead
              </label>
              {isGiftDelivery && (
                <div className="mt-3 space-y-2.5">
                  <input
                    type="email"
                    required={isGiftDelivery}
                    placeholder="Recipient's email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-accent-bright"
                  />
                  <input
                    type="text"
                    maxLength={60}
                    placeholder="Their name (optional)"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-accent-bright"
                  />
                  <textarea
                    maxLength={200}
                    rows={2}
                    placeholder="A short note (optional)"
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-accent-bright"
                  />
                  <p className="text-xs text-white/50">
                    We&apos;ll email {insights.childName}&apos;s finished reading straight to them. Don&apos;t have someone&apos;s child&apos;s birth details yet?{" "}
                    <a href="/gift" className="underline decoration-white/30 underline-offset-2 hover:text-white/80">
                      Send a voucher instead
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>
            <div className="relative mt-4 grid gap-4 sm:grid-cols-2">
              <TierCard
                reportId={reportId}
                tierId="full"
                gift={isGiftDelivery ? { recipientEmail, recipientName, giftNote } : undefined}
                giftIncomplete={isGiftDelivery && !recipientEmail}
              />
              <TierCard
                reportId={reportId}
                tierId="premium"
                highlight
                gift={isGiftDelivery ? { recipientEmail, recipientName, giftNote } : undefined}
                giftIncomplete={isGiftDelivery && !recipientEmail}
              />
            </div>
            <p className="relative mt-6 text-center text-xs text-white/50">
              <a
                href="mailto:contact@littlestargazer.com"
                className="underline decoration-white/30 underline-offset-2 hover:text-white/80"
              >
                Questions before you buy?
              </a>
              {" · "}
              <a
                href="/sample"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/30 underline-offset-2 hover:text-white/80"
              >
                See a full sample reading
              </a>
            </p>
          </div>
        ),
      },
    ],
    [chart, insights, meta, tier, reportId, isGiftDelivery, recipientEmail, recipientName, giftNote],
  );

  const pages: BookPage[] = useMemo(() => {
    if (!tier || !pathway) return freePages;

    const showRemedies = tier === "premium" ? remedies : null;
    const showCareerDeepDive = tier === "premium" ? careerDeepDive : null;
    const pathwayPages = buildPathwayPages(pathway, insights.childName, showRemedies, showCareerDeepDive);
    const withUpsell: BookPage[] =
      tier === "full"
        ? [
            ...pathwayPages,
            {
              id: "upsell",
              chapterLabel: "Add the deeper chapters",
              background: "bg-primary-dark text-white",
              content: (
                <div className="relative flex min-h-[18rem] flex-col items-center justify-center text-center sm:min-h-[20rem]">
                  <ChartWheel className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 text-white/5" />
                  <div className="relative max-w-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-bright">
                      Two more ways to go deeper
                    </p>
                    <h2 className="mt-3 font-serif text-xl font-semibold sm:text-2xl">
                      Add the career deep-dive and gentle remedies
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      A ranked look across every career field {insights.childName}
                      &apos;s chart speaks to, plus small, loving rituals built
                      from their own chart — a color, a day, one small object
                      or habit. Never gemstones, never prescriptive.
                    </p>
                    <form action={createCheckoutSessionAction} className="mt-5">
                      <input type="hidden" name="reportId" value={reportId} />
                      <input type="hidden" name="tier" value="premium" />
                      <button
                        type="submit"
                        className="rounded-sm bg-accent-bright px-6 py-3 text-sm font-semibold text-primary-dark shadow-lg shadow-black/20 transition-transform hover:scale-[1.02]"
                      >
                        Add for {formatCents(UPGRADE_TO_PREMIUM_CENTS)}
                      </button>
                    </form>
                  </div>
                </div>
              ),
            },
          ]
        : pathwayPages;

    const feedbackPage: BookPage = {
      id: "feedback",
      chapterLabel: "Share your thoughts",
      background: "bg-primary-dark text-white",
      content: (
        <div className="relative mx-auto max-w-sm text-center">
          <ChartWheel className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 text-white/5" />
          <div className="relative">
            <SparkleIcon className="mx-auto h-7 w-7 text-accent-bright" />
            <h2 className="mt-3 font-serif text-xl font-semibold sm:text-2xl">
              How did this feel?
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              This is a small, independent project — real feedback like
              yours is what shapes it. Entirely optional.
            </p>
            <div className="mt-6">
              <ReportFeedbackForm reportId={reportId} tier={tier} childName={insights.childName} />
            </div>
          </div>
        </div>
      ),
    };

    return [...freePages.slice(0, -1), ...withUpsell, feedbackPage];
  }, [freePages, tier, pathway, remedies, careerDeepDive, insights.childName, reportId]);

  const [pageIndex, setPageIndex] = useState(() => {
    if (!initialPageId) return 0;
    const found = pages.findIndex((p) => p.id === initialPageId);
    return found >= 0 ? found : 0;
  });

  return (
    <UnlockReveal active={!!justUnlocked} childName={insights.childName} chart={chart}>
    <div>
      <BookReader
        pages={pages}
        index={pageIndex}
        onIndexChange={setPageIndex}
        headerRight={
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3.5 py-1.5 text-xs font-medium text-primary-dark transition-colors hover:bg-primary-tint"
          >
            <PrinterIcon className="h-3.5 w-3.5" />
            Save / print
          </button>
        }
      />

      {/* General reminders that apply to every reading -- kept as a
          footnote rather than a chapter, since it isn't specific to this
          child's chart. */}
      <div className="mt-6 rounded-md border border-border-soft bg-surface-raised p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
          <MoonIcon className="h-3.5 w-3.5 text-accent" />A few gentle reminders
        </div>
        <ul className="mt-3 space-y-1.5 pl-[22px] text-xs leading-5 text-foreground/65">
          {insights.learningTips.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span aria-hidden className="text-accent">·</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </UnlockReveal>
  );
}
