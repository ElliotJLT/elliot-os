"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    intro: "Products, systems and research built around the judgement before something ships.",
    items: [
      {
        eyebrow: "01 · shipped",
        title: "In production",
        href: "/built#production",
      },
      {
        eyebrow: "02 · method",
        title: "The through-line",
        href: "/built#through-line",
      },
      {
        eyebrow: "03 · systems",
        title: "Argus",
        href: "/built#argus",
      },
      {
        eyebrow: "04 · published",
        title: "Research",
        href: "/built#research",
      },
      {
        eyebrow: "05 · open source",
        title: "Agent tools",
        href: "/built#agent-tools",
      },
    ],
    feature: {
      eyebrow: "Selected work",
      title: "Judgement before output.",
      copy: "Products and systems built for the point where a plausible answer still is not safe enough to ship.",
      cta: "See everything built",
    },
  },
  {
    href: "/writing",
    label: "writing",
    listLabel: "Read by subject",
    intro: "Essays on shipping AI where a plausible wrong answer still carries real cost.",
    items: [
      {
        eyebrow: "01 · product",
        title: "Product engineering",
        href: "/writing#essays",
      },
      {
        eyebrow: "02 · systems",
        title: "Agent loops",
        href: "https://medium.com/@elliotJL/the-loop-was-never-the-hard-part-5bdd4352acab",
      },
      {
        eyebrow: "03 · practice",
        title: "The end of the handoff",
        href: "https://medium.com/@elliotJL/the-product-engineer-and-the-end-of-the-handoff-93181f170779",
      },
      {
        eyebrow: "04 · deployment",
        title: "Trust and adoption",
        href: "/writing#essays",
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
      copy: "Essays on shipping AI, responsible deployment, and the human judgement the loop cannot automate.",
      cta: "Read all writing",
    },
  },
];

const LINKS = [
  ["/loops", "loops"],
  ["/changelog", "changelog"],
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
  return (
    <div className="nav-menu">
      <Link
        className="nav-menu-trigger"
        href={menu.href}
        data-active={active || undefined}
        aria-haspopup="true"
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
