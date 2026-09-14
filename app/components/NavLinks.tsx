"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { THEMES } from "@/lib/themes";

// Menu rows say what Elliot did, not which category it sits in, and each
// eyebrow names the site theme it belongs to (lib/themes.ts).
const [WRONG, LEADING, AGENTS] = THEMES;

type MenuItem = {
  eyebrow: string;
  title: string;
  href: string;
};

type Menu = {
  href: string;
  label: string;
  listLabel: string;
  intro: string;
  items: MenuItem[];
  feature: {
    eyebrow: string;
    title: string;
    copy: string;
    cta: string;
  };
};

const MENUS: Menu[] = [
  {
    href: "/built",
    label: "built",
    listLabel: "Explore the work",
    intro: "The judgement before something ships.",
    items: [
      {
        eyebrow: `01 · ${WRONG.short}`,
        title: "Shipped AI to students and families",
        href: "/built#production",
      },
      {
        eyebrow: `02 · ${WRONG.short}`,
        title: "Built safeguarding and career tools",
        href: "/built#independent-work",
      },
      {
        eyebrow: `03 · ${AGENTS.short}`,
        title: "Built a fleet that reads for me",
        href: "/built#argus",
      },
      {
        eyebrow: `04 · ${AGENTS.short}`,
        title: "Measured the human in the loop",
        href: "/built#research",
      },
      {
        eyebrow: `05 · ${AGENTS.short}`,
        title: "Open-sourced tools for agent work",
        href: "/built#agent-tools",
      },
    ],
    feature: {
      eyebrow: "Selected work",
      title: "Judgement before output.",
      copy: "Built for the point where plausible is not yet safe to ship.",
      cta: "See everything built",
    },
  },
  {
    href: "/writing",
    label: "writing",
    listLabel: "Read by subject",
    intro: "Essays from shipping AI where errors cost.",
    items: [
      {
        eyebrow: `01 · ${WRONG.short}`,
        title: "When wrong answers cost",
        href: `/writing#${WRONG.id}`,
      },
      {
        eyebrow: `02 · ${LEADING.short}`,
        title: "Leading the team while building it",
        href: `/writing#${LEADING.id}`,
      },
      {
        eyebrow: `03 · ${AGENTS.short}`,
        title: "Loops, stopping rules and evals",
        href: `/writing#${AGENTS.id}`,
      },
      {
        eyebrow: "04 · earlier",
        title: "Before the AI work",
        href: "/writing#earlier",
      },
      {
        eyebrow: "05 · conversation",
        title: "Listen",
        href: "/writing#podcast",
      },
    ],
    feature: {
      eyebrow: "Notes from the field",
      title: "Where wrong answers carry real cost.",
      copy: "Shipping AI, and the judgement the loop cannot automate.",
      cta: "Read all writing",
    },
  },
];

// /changelog still exists (the footer links to it as the receipts) but it is
// not a destination, so it does not earn a slot in the nav.
const LINKS = [
  ["/evals", "evals"],
  ["/loops", "loops"],
] as const;

function NavMenu({
  menu,
  active,
  basePath,
}: {
  menu: Menu;
  active: boolean;
  basePath: string;
}) {
  // Open state lives in React rather than in :hover alone. Pure :hover had
  // two failures: the trigger sits inside the nav pill, so moving straight
  // down to the panel crossed the pill's padding, lost the hover and closed
  // the menu before the pointer reached it; and clicking the trigger
  // navigated, which re-rendered the nav and dropped the menu on the new
  // page. Now hover opens with a short grace on leave, click toggles, and
  // Escape, an outside click or a route change closes.
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const hoverCapable = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
  const clear = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };
  const enter = () => {
    if (!hoverCapable()) return;
    clear();
    setOpen(true);
  };
  const leave = () => {
    if (!hoverCapable()) return;
    clear();
    timer.current = window.setTimeout(() => setOpen(false), 180);
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      clear();
    };
  }, [open]);

  return (
    <div
      className="nav-menu"
      ref={ref}
      data-open={open || undefined}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <Link
        className="nav-menu-trigger"
        href={menu.href}
        data-active={active || undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          clear();
          setOpen((o) => !o);
        }}
      >
        {menu.label}
        <svg viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1.5C3 4.5 7 4.5 9 1.5" />
        </svg>
      </Link>

      <div className="nav-menu-shell">
        <div className="nav-menu-panel">
          <div className="nav-menu-index">
            <span className="nav-menu-label">{menu.listLabel}</span>
            <p className="nav-menu-intro">{menu.intro}</p>
            <div className="nav-menu-items">
              {menu.items.map((item) => (
                <Link
                  key={`${menu.href}-${item.eyebrow}`}
                  href={item.href}
                  aria-label={`${item.title}, ${item.eyebrow.slice(5)}`}
                >
                  <span className="nav-menu-mark" aria-hidden="true">
                    {item.eyebrow.slice(0, 2)}
                  </span>
                  <strong>{item.title}</strong>
                  <span className="nav-menu-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
            <Link className="nav-menu-all" href={menu.href}>
              All {menu.label} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <Link className="nav-menu-feature" href={menu.href}>
            {/* Decorative: the adjacent text names and describes the feature. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="nav-menu-art"
              src={`${basePath}/nav-${menu.label}.jpg`}
              alt=""
            />
            <span className="nav-feature-eyebrow">{menu.feature.eyebrow}</span>
            <strong>{menu.feature.title}</strong>
            <p>{menu.feature.copy}</p>
            <span className="nav-feature-cta">
              {menu.feature.cta} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function NavLinks({ basePath = "" }: { basePath?: string }) {
  const pathname = usePathname();

  return (
    <>
      {MENUS.map((menu) => (
        <NavMenu
          key={menu.href}
          menu={menu}
          active={pathname.startsWith(menu.href)}
          basePath={basePath}
        />
      ))}
      {LINKS.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          className={href === "/loops" ? "nav-loops-link" : undefined}
          data-active={pathname.startsWith(href) || undefined}
          aria-label={href === "/loops" ? "Loops" : undefined}
        >
          {href === "/loops" ? (
            <span className="nav-loops-label">
              <span aria-hidden="true">l</span>
              <span className="nav-loops-core" aria-hidden="true">
                <span className="nav-loops-plain">oo</span>
                <span className="nav-loops-mark">
                  <span className="nav-loops-lemni">
                    <svg viewBox="0 0 84 48" focusable="false">
                      <path
                        className="nav-loops-trace"
                        d="M42 24 C42 9 58 5 68 11 C78 17 78 31 68 37 C58 43 42 39 42 24 C42 9 26 5 16 11 C6 17 6 31 16 37 C26 43 42 39 42 24 Z"
                        pathLength={100}
                      />
                    </svg>
                  </span>
                </span>
              </span>
              <span aria-hidden="true">ps</span>
            </span>
          ) : (
            label
          )}
        </Link>
      ))}
    </>
  );
}
