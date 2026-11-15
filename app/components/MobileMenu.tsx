"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";

// The desktop nav's dropdowns don't fit a phone, and below 720px the links
// were simply hidden. This is the phone version: a burger beside the theme
// toggle, one tap for a plain list. Hidden on desktop in CSS.
const LINKS = [
  { href: "/built", label: "Built" },
  { href: "/writing", label: "Writing" },
  { href: "/evals", label: "Evals" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // A new page closes the menu.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div className="mob-menu" ref={ref}>
      <button
        ref={btnRef}
        type="button"
        className="mob-menu-btn"
        aria-expanded={open}
        aria-controls="mob-menu-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        {/* Three lines of unequal length that straighten into an X. They
            sit centred and are scaled and nudged into place in CSS, so the
            same transform list can animate between the two states. */}
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path className="mob-line mob-line-1" d="M4 12h16" />
          <path className="mob-line mob-line-2" d="M4 12h16" />
          <path className="mob-line mob-line-3" d="M4 12h16" />
        </svg>
      </button>
      {/* Kept mounted so it can animate out; inert while closed keeps it
          out of the tab order and away from screen readers. */}
      <nav
        id="mob-menu-panel"
        className="mob-menu-panel"
        aria-label="Sections"
        data-open={open || undefined}
        inert={!open}
      >
        {LINKS.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            style={{ "--i": i } as React.CSSProperties}
            data-active={pathname?.startsWith(l.href) || undefined}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        <a
          className="mob-menu-mail"
          style={{ "--i": LINKS.length } as React.CSSProperties}
          href="mailto:elliotjlittle@gmail.com"
        >
          Get in touch
        </a>
      </nav>
    </div>
  );
}
