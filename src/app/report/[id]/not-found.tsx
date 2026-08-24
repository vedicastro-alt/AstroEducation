import Link from "next/link";

export default function ReportNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-5 py-20 text-center">
      <span aria-hidden className="text-3xl">
        🔭
      </span>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-primary-dark">
        We couldn&apos;t find that reading
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        This link may be mistyped, or the reading may no longer be
        available. You&apos;re welcome to create a new one.
      </p>
      <Link
        href="/report"
        className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Create a reading
      </Link>
    </div>
  );
}
