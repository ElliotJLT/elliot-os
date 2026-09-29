"use client";

import { useEffect, useRef } from "react";
import type { Role } from "@/lib/roles";
import Reveal from "./Reveal";

const basePath = process.env.BASE_PATH || "";

/**
 * Career as a timeline of panels, Zero Gravity first and Flash Pack last.
 * The rail draws down as the section is read; each logo lights as the line
 * reaches it and its card slides in from the rail side, once. The words
 * lead; a team photo runs full width under them. Each bullet
 * lights the same way, as the line draws level with it. A reference sits
 * under its role as a quote panel. Reduced motion shows the rail drawn and
 * everything in place.
 */
export default function Career({ roles }: { roles: Role[] }) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = [...list.querySelectorAll<HTMLElement>(".cr-item")];
    const points = [...list.querySelectorAll<HTMLElement>(".cr-points li")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      list.style.setProperty("--draw", "1");
      [...items, ...points].forEach((it) => it.setAttribute("data-reached", ""));
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = list.getBoundingClientRect();
      // Drawn to the point two thirds down the screen: where the eye is.
      const reach = window.innerHeight * 0.66 - r.top;
      const draw = Math.min(1, Math.max(0, reach / r.height));
      list.style.setProperty("--draw", draw.toFixed(4));
      // A role's logo lights once the drawn line reaches it, and stays lit.
      const tip = draw * r.height;
      items.forEach((it) => {
        if (it.offsetTop + 40 <= tip) it.setAttribute("data-reached", "");
      });
      // Bullets light as the tip draws level with them, and stay lit.
      points.forEach((pt) => {
        if (pt.getBoundingClientRect().top - r.top + 10 <= tip) pt.setAttribute("data-reached", "");
      });
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);

  return (
    <div className="cr">
      <ol className="cr-line" ref={listRef}>
        {roles.map((r) => (
          <li key={r.org} className="cr-item">
            {r.logo && (
              // The card's heading names the company.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="cr-logo"
                src={`${basePath}/${r.logo}`}
                alt=""
                width={44}
                height={44}
              />
            )}
            <Reveal>
              <article className="cr-card cr-slide">
                <div className="cr-body">
                  <h3>{r.url ? <a href={r.url}>{r.org}</a> : r.org}</h3>
                  {(r.role || r.dates) && (
                    <span className="career-meta">
                      {[r.role, r.dates].filter(Boolean).join(" · ")}
                    </span>
                  )}
                  <ul className="cr-points">
                    {r.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
                {r.photo && (
                  <figure className="cr-photo rv-develop">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${basePath}/${r.photo}`}
                      alt={r.photoAlt || ""}
                      loading="lazy"
                    />
                  </figure>
                )}
                {r.quote && (
                  <figure className="cr-quote">
                    <span className="cr-quote-mark" aria-hidden="true">
                      &ldquo;
                    </span>
                    <blockquote>
                      {r.quote.paras.map((q) => (
                        <p key={q}>{q}</p>
                      ))}
                    </blockquote>
                    <figcaption>
                      <strong>{r.quote.name}</strong> · {r.quote.role}
                    </figcaption>
                  </figure>
                )}
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
