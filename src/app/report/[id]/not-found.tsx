import Link from "next/link";
import { TelescopeIcon } from "@/components/icons";

export default function ReportNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-tint text-primary">
        <TelescopeIcon className="h-6 w-6" />
      </span>
      <h1 className="mt-5 font-serif text-2xl font-semibold text-primary-dark">
        We couldn&apos;t find that reading
      </h1>
      <p className="mt-2.5 text-sm leading-6 text-muted">
        This link may be mistyped, or the reading may no longer be
        available. You&apos;re welcome to create a new one.
      </p>
      <Link
        href="/report"
        className="mt-7 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-colors hover:bg-primary-dark"
      >
        Create a reading
      </Link>
    </div>
  );
}
