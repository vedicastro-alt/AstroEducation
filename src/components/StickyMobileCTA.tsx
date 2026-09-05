"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

// Only the pages whose whole job is to send someone toward /report --
// not the form itself (redundant there), not a paid reading (that page
// sells its own upgrade inline), and not the utility pages (gift,
// support, resend, privacy, terms) where this would be noise.
const SHOWN_PATHS = new Set(["/", "/about", "/faq", "/sample"]);

/**
 * A thumb-reach-zone CTA pinned to the bottom of the viewport on mobile,
 * distinct from the header's top-sticky one -- see HANDOFF.md §38 item 1.
 * The spacer div (same height, normal flow) reserves room at the true
 * end of the page so this bar never permanently covers the footer's
 * last line once a visitor scrolls all the way down.
 */
export function StickyMobileCTA() {
  const pathname = usePathname();
  const eligible = SHOWN_PATHS.has(pathname) || pathname.startsWith("/blog");
  if (!eligible) return null;

  return (
    <>
      <div aria-hidden className="h-20 sm:hidden" />
      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-border-soft bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_-16px_rgba(44,40,97,0.25)] backdrop-blur-md sm:hidden">
        <Link
          href="/report"
          className="block w-full rounded-sm bg-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-colors hover:bg-primary-dark"
        >
          Get your child&apos;s free reading
        </Link>
      </div>
    </>
  );
}
