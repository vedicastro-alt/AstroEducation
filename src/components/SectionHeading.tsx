import type { SVGProps } from "react";

export function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: (props: SVGProps<SVGSVGElement>) => React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-2.5 font-serif text-xl font-semibold text-primary-dark sm:text-2xl">
      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary-tint text-primary">
        <Icon className="h-4 w-4" />
      </span>
      {children}
    </h2>
  );
}
