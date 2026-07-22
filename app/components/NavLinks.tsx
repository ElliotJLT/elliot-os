"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["/built", "built"],
  ["/now", "now"],
  ["/next", "next"],
  ["/funnel", "funnel"],
  ["/changelog", "changelog"],
] as const;

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {LINKS.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          data-active={pathname.startsWith(href) || undefined}
        >
          {label}
        </Link>
      ))}
    </>
  );
}
