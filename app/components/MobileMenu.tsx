"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// The desktop nav's dropdowns don't fit a phone, and below 720px the links
// were simply hidden. This is the phone version: a burger beside the theme
// toggle, one tap for a plain list. Hidden on desktop in CSS.
const LINKS = [
  { href: "/built", label: "Built" },
  { href: "/writing", label: "Writing" },
  { href: "/evals", label: "Evals" },
  { href: "/loops", label: "Loops" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  // A new page closes the menu.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
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
        type="button"
        className="mob-menu-btn"
        aria-expanded={open}
        aria-controls="mob-menu-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>
      {open && (
        <nav id="mob-menu-panel" className="mob-menu-panel" aria-label="Sections">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-active={pathname?.startsWith(l.href) || undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <a className="mob-menu-mail" href="mailto:elliotjlittle@gmail.com">
            Get in touch
          </a>
        </nav>
      )}
    </div>
  );
}
