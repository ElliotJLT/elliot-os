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
  icon,
  iconOnly = false,
  tone = "soft",
}: {
  href: string;
  children: React.ReactNode;
  arrow?: boolean;
  icon?: "mail" | "coffee";
  iconOnly?: boolean;
  tone?: "soft" | "solid" | "cream" | "ghost";
}) {
  const cls = `pill pill-${tone}${iconOnly ? " pill-icon-only" : ""}`;
  const accessibleLabel =
    iconOnly && typeof children === "string" ? children : undefined;
  const inner = (
    <>
      {icon && <PillIcon name={icon} />}
      {!iconOnly && <span>{children}</span>}
      {arrow && <span className="pill-arrow" aria-hidden="true">→</span>}
    </>
  );
  return href.startsWith("/") ? (
    <Link
      className={cls}
      href={href}
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      {inner}
    </Link>
  ) : (
    <a
      className={cls}
      href={href}
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      {inner}
    </a>
  );
}

function PillIcon({ name }: { name: "mail" | "coffee" }) {
  return name === "mail" ? (
    <svg
      className="pill-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ) : (
    <svg
      className="pill-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 8h11v5.5A4.5 4.5 0 0 1 11.5 18h-2A4.5 4.5 0 0 1 5 13.5V8Z" />
      <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M4 21h15" />
      <path d="M8 3v2M12 3v2" />
    </svg>
  );
}
