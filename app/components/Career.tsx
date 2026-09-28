"use client";

import { useEffect, useRef } from "react";
import type { Role } from "@/lib/roles";
import Reveal from "./Reveal";

const basePath = process.env.BASE_PATH || "";

/**
 * Career as a timeline of panels, Zero Gravity first and Flash Pack last.
 * The one motion is the rail: it draws down as the section is read, so the
 * line reaches each role as you do. Cards settle in once with the site's
 * usual reveal, team photos develop into focus, and a reference from the
 * person who managed Elliot there sits on the photo as a pill. Reduced
 * motion shows the rail drawn and everything in place.
 */
export default function Career({ roles }: { roles: Role[] }) {
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      list.style.setProperty("--draw", "1");
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
              <article className="cr-card rv-settle">
                {r.photo && (
                  <figure className="cr-photo rv-develop">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${basePath}/${r.photo}`}
                      alt={r.photoAlt || ""}
                      loading="lazy"
                    />
                    {r.quote && (
                      <figcaption className="cr-quote">
                        <blockquote>{r.quote.text}</blockquote>
                        <span className="cr-quote-by">
                          <strong>{r.quote.name}</strong> · {r.quote.role}
                        </span>
                      </figcaption>
                    )}
                  </figure>
                )}
                <div className="cr-body">
                  <h3>{r.url ? <a href={r.url}>{r.org}</a> : r.org}</h3>
                  {(r.role || r.dates) && (
                    <span className="career-meta">
                      {[r.role, r.dates].filter(Boolean).join(" · ")}
                    </span>
                  )}
                  <p>{r.outcome}</p>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
