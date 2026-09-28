"use client";

import { useEffect, useRef } from "react";
import type { Role } from "@/lib/roles";
import Reveal from "./Reveal";

const basePath = process.env.BASE_PATH || "";

/**
 * Career as a timeline of panels, Zero Gravity first and Flash Pack last.
 * The rail draws down as the section is read; each logo lights as the line
 * reaches it and its card slides in from the rail side, once. The words
 * lead each card; a team photo sits beside them. Reduced motion shows the
 * rail drawn and everything in place.
 */
export default function Career({ roles }: { roles: Role[] }) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = [...list.querySelectorAll<HTMLElement>(".cr-item")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      list.style.setProperty("--draw", "1");
      items.forEach((it) => it.setAttribute("data-reached", ""));
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
                  <p>{r.outcome}</p>
                  {r.quote && (
                    <figure className="cr-ref">
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
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
