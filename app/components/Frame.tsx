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

/** One simple line icon per build, in the same single-colour currentColor
 *  style as the footer's brand marks — standing in for a screenshot until
 *  one exists, and honest about which build is which rather than a dashed
 *  placeholder box. */
export function WorkIcon({ name }: { name: "tutor" | "ward" | "argus" | "crux" }) {
  return (
    <div className="work-icon">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {name === "tutor" && (
          <>
            <path d="M4 5c2 0 5 .8 6 2v12c-1-1.2-4-2-6-2V5z" />
            <path d="M20 5c-2 0-5 .8-6 2v12c1-1.2 4-2 6-2V5z" />
          </>
        )}
        {name === "ward" && (
          <path d="M12 3l7 3v6c0 5-3.5 7.8-7 9-3.5-1.2-7-4-7-9V6l7-3z" />
        )}
        {name === "argus" && (
          <>
            <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="2.6" />
          </>
        )}
        {name === "crux" && (
          <>
            <circle cx="12" cy="4.5" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="6" cy="19.5" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="18" cy="19.5" r="1.4" fill="currentColor" stroke="none" />
            <path d="M12 6v4M12 10L6 18M12 10l6 8" />
          </>
        )}
      </svg>
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
