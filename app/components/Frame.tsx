import Link from "next/link";

/** A labelled box where an image will go. Keeps the layout honest before the
 *  art exists: real aspect ratio, real space, and it says what belongs in it
 *  rather than pretending to be finished. */
export function Slot({
  label,
  ratio = "4 / 3",
  max,
  painted = false,
}: {
  label: string;
  ratio?: string;
  max?: number;
  painted?: boolean;
}) {
  return (
    <div
      className={"slot" + (painted ? " painted" : "")}
      style={{ aspectRatio: ratio, maxWidth: max ? `${max}px` : undefined }}
    >
      <span>{label}</span>
    </div>
  );
}

/** The pill button MAI uses for every call to action. */
export function Pill({
  href,
  children,
  arrow = false,
  tone = "soft",
}: {
  href: string;
  children: React.ReactNode;
  arrow?: boolean;
  tone?: "soft" | "solid" | "cream" | "ghost";
}) {
  const cls = `pill pill-${tone}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <span className="pill-arrow" aria-hidden="true">→</span>}
    </>
  );
  return href.startsWith("/") ? (
    <Link className={cls} href={href}>
      {inner}
    </Link>
  ) : (
    <a className={cls} href={href}>
      {inner}
    </a>
  );
}
