"use client";

import { useEffect, useRef, useState } from "react";
import type { Role } from "@/lib/roles";
import Reveal from "./Reveal";

const basePath = process.env.BASE_PATH || "";

// Longer roles show their first four bullets; the rest open on request.
const SHOWN = 4;

/** Fired when he's thrown, so the other rail on the page loses him too. */
const GONE = "elliot-flung";

/** The year a role started, from "Feb 2022 – Aug 2026". */
const startYear = (dates?: string) => dates?.match(/\d{4}/)?.[0];

// The rail's x inside the list, and how far the line stands off a logo as it
// goes round it.
const X = 22;
// 33: wide enough that the face riding the tip clears the logo it circles.
const LOGO_R = 33;
// Half the gap between roles, where each year stop sits over the line.
const GAP = 16;

/**
 * The rail as one path: straight down the list, bending round the right of
 * each logo in a half circle, so the line and the dot riding its tip trace
 * the logo's outline. Year stops sit over the line, which runs behind them;
 * the path ends at the last one.
 */
function railPath(list: HTMLElement) {
  let d = `M${X} 0`;
  let y = 0;
  list.querySelectorAll<HTMLElement>(".cr-item").forEach((it) => {
    if (it.querySelector(".cr-logo")) {
      const c = it.offsetTop + 40;
      d += ` L${X} ${c - LOGO_R} A${LOGO_R} ${LOGO_R} 0 0 1 ${X} ${c + LOGO_R}`;
      y = c + LOGO_R;
    }
    if (it.querySelector(".cr-year")) y = it.offsetTop + it.offsetHeight + GAP;
  });
  d += ` L${X} ${y}`;
  return { d, end: y };
}

/**
 * Career as a timeline of panels, Zero Gravity first and Flash Pack last.
 * The rail draws down as the section is read, bending round each logo and
 * year stop, with a dot on its tip. Each logo lights as the line
 * reaches it and its card slides in from the rail side, once. The words
 * lead; a team photo runs full width under them. Each bullet
 * lights the same way, as the line draws level with it. A reference sits
 * under its role as a quote panel. Reduced motion shows the rail drawn and
 * everything in place.
 */
/**
 * A marker-pen loop drawn round Elliot's face in a team photo when the photo
 * comes into view. The photo is cropped with object-fit: cover, so the face's
 * place in the image is mapped onto the box it's shown in.
 */
function FaceMark({ face }: { face: { x: number; y: number; r: number } }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    const fig = svg?.parentElement;
    const img = fig?.querySelector("img");
    if (!svg || !fig || !img) return;
    const place = () => {
      if (!img.naturalWidth) return;
      const W = fig.clientWidth;
      const H = fig.clientHeight;
      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const [px, py] = getComputedStyle(img).objectPosition.split(" ").map((v) => parseFloat(v) / 100);
      const x = (W - w) * px + face.x * w;
      const y = (H - h) * py + face.y * h;
      const r = face.r * w * 1.25;
      Object.assign(svg.style, { left: `${x - r}px`, top: `${y - r}px`, width: `${r * 2}px`, height: `${r * 2}px` });
    };
    place();
    img.addEventListener("load", place);
    const resized = new ResizeObserver(place);
    resized.observe(fig);
    const seen = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          svg.setAttribute("data-drawn", "");
          seen.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    seen.observe(fig);
    return () => {
      img.removeEventListener("load", place);
      resized.disconnect();
      seen.disconnect();
    };
  }, [face]);
  return (
    <svg className="cr-mark" ref={ref} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path
        pathLength={1}
        d="M20 38 C25 13 73 7 87 33 C98 57 76 89 47 89 C19 89 7 66 13 46 C17 31 33 20 55 19"
      />
    </svg>
  );
}

export default function Career({ roles, id = "career" }: { roles: Role[]; id?: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const drawnRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<HTMLImageElement>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const list = listRef.current;
    const svg = svgRef.current;
    const track = trackRef.current;
    const drawn = drawnRef.current;
    const dot = tipRef.current;
    if (!list || !svg || !track || !drawn || !dot) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Once he's been picked up and thrown, he's gone from this rail and the
    // mentoring one until the page loads again.
    let gone = false;
    const vanish = () => {
      gone = true;
      dot.hidden = true;
    };
    window.addEventListener(GONE, vanish);

    // Length along the path against depth, sampled once per layout, so the
    // tip's depth on screen maps to how much of the path to draw.
    let total = 0;
    let end = 0;
    let samples: { len: number; y: number }[] = [];
    const layout = () => {
      const path = railPath(list);
      end = path.end;
      track.setAttribute("d", path.d);
      drawn.setAttribute("d", path.d);
      svg.setAttribute("height", String(Math.ceil(end + 4)));
      total = track.getTotalLength();
      samples = [];
      for (let len = 0; len <= total; len += 3) samples.push({ len, y: track.getPointAtLength(len).y });
      samples.push({ len: total, y: end });
    };
    const lengthAt = (y: number) => {
      let lo = 0;
      let hi = samples.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (samples[mid].y < y) lo = mid + 1;
        else hi = mid;
      }
      return samples[lo]?.len ?? 0;
    };

    // Pick him up and he follows the pointer; let go and he flies on with the
    // throw, falls under gravity off the screen, and doesn't come back. The
    // flight is a copy on the page, so the rail's own element stays React's.
    const grab = (e: PointerEvent) => {
      if (gone) return;
      e.preventDefault();
      const box = dot.getBoundingClientRect();
      const body = dot.cloneNode() as HTMLImageElement;
      body.removeAttribute("hidden");
      body.className = "cr-flung";
      body.style.width = `${box.width}px`;
      document.body.appendChild(body);
      vanish();
      window.dispatchEvent(new Event(GONE));

      const dx = e.clientX - box.left;
      const dy = e.clientY - box.top;
      let x = box.left;
      let y = box.top;
      let rot = 0;
      const trail: { x: number; y: number; t: number }[] = [];
      const place = () => {
        body.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      };
      place();
      document.documentElement.style.cursor = "grabbing";
      const move = (m: PointerEvent) => {
        x = m.clientX - dx;
        y = m.clientY - dy;
        trail.push({ x, y, t: m.timeStamp });
        if (trail.length > 6) trail.shift();
        place();
      };
      const drop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", drop);
        window.removeEventListener("pointercancel", drop);
        body.classList.add("is-thrown");
        document.documentElement.style.cursor = "";
        // Throw speed from the last few pointer moves, in px per frame.
        const a = trail[0];
        const b = trail[trail.length - 1];
        const dt = a && b && b.t > a.t ? (b.t - a.t) / 16.7 : 1;
        let vx = a && b ? (b.x - a.x) / dt : 0;
        let vy = a && b ? (b.y - a.y) / dt : 0;
        const spin = vx * 0.6 + 2;
        const fly = () => {
          vy += 0.7;
          vx *= 0.995;
          x += vx;
          y += vy;
          rot += spin;
          place();
          const off = y > window.innerHeight + 200 || x < -300 || x > window.innerWidth + 300;
          if (off) body.remove();
          else requestAnimationFrame(fly);
        };
        requestAnimationFrame(fly);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", drop);
      window.addEventListener("pointercancel", drop);
    };
    dot.addEventListener("pointerdown", grab);

    let frame = 0;
    const update = () => {
      frame = 0;
      const items = [...list.querySelectorAll<HTMLElement>(".cr-item")];
      const points = [...list.querySelectorAll<HTMLElement>(".cr-points li")];
      const r = list.getBoundingClientRect();
      // The tip sits two thirds down the screen: where the eye is.
      const tip = still ? end : Math.min(end, Math.max(0, window.innerHeight * 0.66 - r.top));
      const len = still ? total : lengthAt(tip);
      drawn.style.strokeDasharray = `${len} ${total}`;
      const at = track.getPointAtLength(len);
      // A slow sway as he falls, driven by how far down the line he is.
      const sway = Math.sin(len / 90) * 14;
      if (!gone) dot.style.transform = `translate(${at.x}px, ${at.y}px) translate(-50%, -50%) rotate(${sway.toFixed(1)}deg)`;
      list.toggleAttribute("data-drawing", !still && len > 0 && len < total);
      // Logos light as the line starts round them; a year types itself in
      // as the tip reaches it; bullets light as the tip draws level. Each
      // stays lit.
      items.forEach((it) => {
        if (it.offsetTop + 18 <= tip) it.setAttribute("data-reached", "");
        if (it.offsetTop + it.offsetHeight + GAP <= tip) it.setAttribute("data-passed", "");
      });
      points.forEach((pt) => {
        if (pt.getBoundingClientRect().top - r.top + 10 <= tip) pt.setAttribute("data-reached", "");
      });
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Heights move as images load and roles open, so the path is redrawn
    // whenever the list changes size.
    const resized = new ResizeObserver(() => {
      layout();
      queue();
    });
    resized.observe(list);
    layout();
    update();
    window.addEventListener("scroll", queue, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      resized.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener(GONE, vanish);
      dot.removeEventListener("pointerdown", grab);
    };
  }, []);

  return (
    <div className="cr">
      <ol className="cr-line" ref={listRef}>
        <li className="cr-rail" aria-hidden="true">
          <svg ref={svgRef} width="80">
            <path className="cr-rail-track" ref={trackRef} />
            <path className="cr-rail-drawn" ref={drawnRef} />
          </svg>
          {/* The tip is Elliot, cut out in black and white with a rust
              outline, falling down his own career. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cr-tip"
            ref={tipRef}
            src={`${basePath}/career/falling.png`}
            alt=""
            width={56}
            height={44}
          />
        </li>
        {roles.map((r) => (
          <li key={r.org} className="cr-item">
            {startYear(r.dates) && (
              <span className="cr-year" aria-hidden="true">
                {startYear(r.dates)}
              </span>
            )}
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
                  <ul className="cr-points" id={`${id}-${r.org}`}>
                    {r.bullets.map((b, i) =>
                      i < SHOWN || expanded[r.org] ? (
                        // Bullets opened by the reader are lit straight away.
                        <li key={b.t} className={i >= SHOWN ? "cr-extra" : undefined}>
                          {b.k && <span className="cr-skill">{b.k}</span>}
                          <span className="cr-proof">{b.t}</span>
                        </li>
                      ) : null,
                    )}
                  </ul>
                  {r.bullets.length > SHOWN && (
                    <button
                      type="button"
                      className="cr-more"
                      aria-expanded={!!expanded[r.org]}
                      aria-controls={`${id}-${r.org}`}
                      onClick={() => setExpanded((e) => ({ ...e, [r.org]: !e[r.org] }))}
                    >
                      {expanded[r.org]
                        ? "Show less ↑"
                        : `${r.bullets.length - SHOWN} more from ${r.org} ↓`}
                    </button>
                  )}
                </div>
                {r.photo && (
                  <figure className="cr-photo rv-develop">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${basePath}/${r.photo}`}
                      alt={r.photoAlt || ""}
                      loading="lazy"
                      style={r.photoPosition ? { objectPosition: r.photoPosition } : undefined}
                    />
                    {r.face && <FaceMark face={r.face} />}
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
