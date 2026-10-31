"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ring } from "./inkMarks";
import { AREAS, WORK, type Area, type Story } from "./work";

/** Scroll per disc, as a share of the viewport height. */
const STEP = 0.72;

/**
 * Where a disc sits for each offset from the one playing, from two back to
 * two ahead: centre x and y as a share of the stage, scale, opacity. The
 * next one waits top right, under the masthead; the last drops away bottom
 * left. Phones run sideways, so nothing passes behind the details.
 */
type Stop = [number, number, number, number];
const STOPS: Stop[] = [
  [0.0, 0.98, 0.46, 0],
  [0.2, 0.76, 0.64, 1],
  [0.5, 0.52, 1, 1],
  [0.84, 0.17, 1.1, 1],
  [1.14, -0.2, 1.22, 0],
];
const STOPS_PHONE: Stop[] = [
  [-1.1, 0.5, 0.86, 0],
  [-0.22, 0.5, 0.86, 1],
  [0.5, 0.5, 1, 1],
  [1.22, 0.5, 0.86, 1],
  [2.1, 0.5, 0.86, 0],
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function place(d: number, stops: Stop[]): Stop {
  const p = clamp(d + 2, 0, 4);
  const i = Math.min(3, Math.floor(p));
  const t = p - i;
  return stops[i].map((v, k) => v + (stops[i + 1][k] - v) * t) as Stop;
}

/** Each disc holds still for the middle of its stretch of scroll. */
function dwell(p: number) {
  const f = Math.floor(p);
  const u = clamp((p - f - 0.2) / 0.6, 0, 1);
  return f + u * u * (3 - 2 * u);
}

/** The pen mark, as a ring in the disc's own plane (viewBox 0 0 100 100). */
const RING = ring(50, 50, 46);

/** A label angle per disc, so they don't all sit square. */
const baseAngle = (story: Story) => ((WORK.indexOf(story) * 37) % 22) - 11;

/**
 * One disc you can handle: it tilts toward the pointer, the shine follows
 * it, and a drag spins the label, which then coasts to a stop. Springs, so
 * nothing snaps.
 */
type Handle = {
  tx: number; ty: number; gx: number; gy: number;
  vx: number; vy: number;
  spin: number; vel: number;
  drag: boolean; lastA: number; lastT: number; moved: number; x0: number; y0: number;
};

const newHandle = (): Handle => ({
  tx: 0, ty: 0, gx: 0, gy: 0, vx: 0, vy: 0, spin: 0, vel: 0,
  drag: false, lastA: 0, lastT: 0, moved: 0, x0: 0, y0: 0,
});

function aim(h: Handle, el: HTMLElement, e: React.PointerEvent) {
  const r = el.getBoundingClientRect();
  const px = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
  const py = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
  h.gx = px * 7;
  h.gy = -py * 7;
  el.style.setProperty("--mx", `${((px + 1) * 50).toFixed(1)}%`);
  el.style.setProperty("--my", `${((py + 1) * 50).toFixed(1)}%`);
  el.style.setProperty("--gx", `${(px * 40).toFixed(1)}deg`);
  if (h.drag) {
    const a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
    let d = ((a - h.lastA) * 180) / Math.PI;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    const now = performance.now();
    const dt = Math.max(8, now - h.lastT) / 1000;
    h.spin += d;
    h.vel = h.vel * 0.5 + (d / dt) * 0.5;
    h.lastA = a;
    h.lastT = now;
    h.moved += Math.hypot(e.clientX - h.x0, e.clientY - h.y0);
    h.x0 = e.clientX;
    h.y0 = e.clientY;
  }
}

function grab(h: Handle, el: HTMLElement, e: React.PointerEvent) {
  const r = el.getBoundingClientRect();
  h.drag = true;
  h.moved = 0;
  h.vel = 0;
  h.x0 = e.clientX;
  h.y0 = e.clientY;
  h.lastT = performance.now();
  h.lastA = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2));
  el.setPointerCapture?.(e.pointerId);
}

function release(h: Handle, el: HTMLElement, out: boolean) {
  h.drag = false;
  if (out) {
    h.gx = 0;
    h.gy = 0;
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
    el.style.removeProperty("--gx");
  }
}

/** Advance the springs; true while anything is still moving. */
function step(h: Handle, dt: number, still: boolean) {
  if (still) {
    h.tx = h.gx;
    h.ty = h.gy;
    h.vx = 0;
    h.vy = 0;
  } else {
    h.vx += ((h.gx - h.tx) * 60 - h.vx * 11) * dt;
    h.vy += ((h.gy - h.ty) * 60 - h.vy * 11) * dt;
    h.tx += h.vx * dt;
    h.ty += h.vy * dt;
  }
  let settling = false;
  if (!h.drag) {
    h.spin += h.vel * dt;
    h.vel *= Math.exp(-dt * 2.4);
    // Once it has slowed, it eases round to land the right way up.
    if (Math.abs(h.vel) < 90) {
      const up = Math.round(h.spin / 360) * 360;
      h.vel += (up - h.spin) * 9 * dt * 60 * dt - h.vel * 3 * dt;
      if (Math.abs(up - h.spin) < 0.05 && Math.abs(h.vel) < 1) {
        h.spin = up;
        h.vel = 0;
      } else settling = true;
    }
  }
  return h.drag || settling || h.vel !== 0 || Math.abs(h.gx - h.tx) + Math.abs(h.gy - h.ty) + Math.abs(h.vx) + Math.abs(h.vy) > 0.01;
}

const tiltOf = (h: Handle, sway = 0) =>
  `rotateZ(-14deg) rotateX(${(44 + h.ty + sway).toFixed(2)}deg) rotateY(${(-10 + h.tx + sway * 0.4).toFixed(2)}deg)`;

/** Hash to filter, so nav links and shared links land on the right set. */
const HASH: Record<string, Area | "all"> = {
  production: "all",
  work: "all",
  prototypes: "prototype",
  ai: "ai",
  safety: "safety",
  gtm: "gtm",
  ops: "ops",
};

/**
 * Everything built, as discs. Scrolling plays them in order: the next comes
 * in from under the masthead, the details change top left, and the discs
 * swing a little as they settle. Filters narrow the set for a reader
 * looking for one kind of work. Opening a disc lays the story out on one
 * screen: the problem, what we explored, the outcome. Scrolling past the
 * end of one loads the next.
 */
export default function DiscGallery({ basePath = "" }: { basePath?: string }) {
  const [filter, setFilter] = useState<Area | "all">("all");
  const work = useMemo(() => (filter === "all" ? WORK : WORK.filter((s) => s.areas.includes(filter))), [filter]);
  const N = work.length;

  const sec = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const discs = useRef<(HTMLButtonElement | null)[]>([]);
  const tilts = useRef<(HTMLSpanElement | null)[]>([]);
  const bodies = useRef<(HTMLSpanElement | null)[]>([]);
  const handles = useRef<Map<string, Handle>>(new Map());
  const dd = useRef<HTMLDivElement>(null);
  const runway = useRef<HTMLDivElement>(null);
  const atRef = useRef(0);
  const workRef = useRef(work);
  workRef.current = work;
  const kick = useRef<() => void>(() => {});
  const advancing = useRef(false);
  const suppress = useRef(false);
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const openRef = useRef<string | null>(null);
  openRef.current = open;
  const [index, setIndex] = useState(false);
  const [enter, setEnter] = useState<"open" | "next">("open");

  const handleFor = (slug: string) => {
    let h = handles.current.get(slug);
    if (!h) {
      h = newHandle();
      handles.current.set(slug, h);
    }
    return h;
  };

  // The loop: eases toward where the page is, places every disc, swings
  // them on a spring when the scroll moves, and runs each disc's handle.
  useEffect(() => {
    const s = sec.current;
    const st = stage.current;
    if (!s || !st) return;
    const root = document.documentElement;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last = 0;
    let sway = 0;
    let swayV = 0;
    const target = () =>
      clamp(-s.getBoundingClientRect().top / (window.innerHeight * STEP), 0, Math.max(0, workRef.current.length - 1));
    let cur = target();
    let prevGoal = cur;

    const paint = (now: number) => {
      frame = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      const list = workRef.current;
      const goal = target();
      const k = still ? 1 : 1 - Math.exp(-dt * 8);
      cur += (goal - cur) * k;
      if (Math.abs(goal - cur) < 1e-4) cur = goal;

      // Dangling: scroll speed pushes the discs back, a soft spring brings
      // them round again.
      const speed = (goal - prevGoal) / dt;
      prevGoal = goal;
      if (!still) {
        const push = clamp(-speed * 2.4, -6, 6);
        swayV += ((push - sway) * 34 - swayV * 5.5) * dt;
        sway += swayV * dt;
      }
      let moving = cur !== goal || Math.abs(sway) + Math.abs(swayV) > 0.02;

      const w = st.clientWidth;
      const h = st.clientHeight;
      const stops = w < 900 ? STOPS_PHONE : STOPS;
      const pos = dwell(cur);
      list.forEach((story, i) => {
        const el = discs.current[i];
        if (!el) return;
        const d = i - pos;
        if (Math.abs(d) > 2.2) {
          el.style.visibility = "hidden";
          return;
        }
        const D = el.offsetWidth;
        const [x, y, sc, o] = place(d, stops);
        el.style.visibility = "visible";
        el.style.transform = `translate3d(${(x * w - D / 2).toFixed(1)}px, ${(y * h - D / 2).toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;
        el.style.opacity = o.toFixed(3);
        el.style.zIndex = String(50 - Math.round(Math.abs(d) * 10));
        const hd = handleFor(story.slug);
        if (step(hd, dt, still)) moving = true;
        // Further discs hang on longer strings.
        const t = tilts.current[i];
        if (t) t.style.transform = tiltOf(hd, sway * (0.8 + Math.abs(d) * 0.35));
        const b = bodies.current[i];
        if (b) b.style.transform = `rotate(${(baseAngle(story) + hd.spin).toFixed(2)}deg)`;
      });

      const active = clamp(Math.round(cur), 0, Math.max(0, list.length - 1));
      if (active !== atRef.current) {
        atRef.current = active;
        setAt(active);
      }
      const r = s.getBoundingClientRect();
      root.classList.toggle("dg-pinned", r.top <= 1 && r.bottom >= window.innerHeight * 0.6);
      if (moving) frame = requestAnimationFrame(paint);
      else last = 0;
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    kick.current = queue;
    paint(performance.now());
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      root.classList.remove("dg-pinned");
    };
  }, []);

  // A new filter re-lays the discs.
  useEffect(() => {
    kick.current();
  }, [work]);

  const scrollTo = useCallback((i: number, behavior: ScrollBehavior = "smooth") => {
    const s = sec.current;
    if (!s) return;
    const top = s.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + i * window.innerHeight * STEP + 1, behavior });
  }, []);

  const choose = useCallback(
    (f: Area | "all") => {
      setFilter(f);
      setIndex(false);
      atRef.current = 0;
      setAt(0);
      requestAnimationFrame(() => scrollTo(0));
    },
    [scrollTo],
  );

  const openStory = useCallback((slug: string) => {
    advancing.current = true;
    setEnter("open");
    setOpen(slug);
    setIndex(false);
    requestAnimationFrame(() =>
      dd.current?.querySelector<HTMLButtonElement>(".dd-art[data-active] .dd-back")?.focus({ preventScroll: true }),
    );
  }, []);

  // Nav links and shared links: #prototypes, #safety, or a story's slug.
  useEffect(() => {
    const read = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      if (!h) return;
      if (h in HASH) {
        choose(HASH[h]);
        return;
      }
      const i = WORK.findIndex((s) => s.slug === h);
      if (i >= 0) {
        setFilter("all");
        requestAnimationFrame(() => {
          scrollTo(i, "instant");
          openStory(h);
        });
      }
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [choose, openStory, scrollTo]);

  const close = useCallback(() => {
    const o = openRef.current;
    // Back on the gallery at the story that was open, which may be a later
    // one than the disc that was clicked.
    const i = workRef.current.findIndex((s) => s.slug === o);
    if (i >= 0 && i !== atRef.current) scrollTo(i, "instant");
    setOpen(null);
    requestAnimationFrame(() => discs.current[atRef.current]?.focus({ preventScroll: true }));
  }, [scrollTo]);

  // While a story is open: the page behind holds still, Escape closes.
  useEffect(() => {
    const root = document.documentElement;
    const on = open !== null;
    root.classList.toggle("dd-lock", on);
    if (!on) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      root.classList.remove("dd-lock");
    };
  }, [open !== null, close]); // eslint-disable-line react-hooks/exhaustive-deps

  // The address follows the open story, so it can be sent on.
  useEffect(() => {
    const url = location.pathname + location.search + (open ? `#${open}` : "");
    if (url !== location.pathname + location.search + location.hash) history.replaceState(null, "", url);
  }, [open]);

  // Each story opens at its top.
  useEffect(() => {
    if (open === null || !dd.current) return;
    dd.current.scrollTop = 0;
    dd.current.style.setProperty("--pull", "0");
    const t = setTimeout(() => {
      advancing.current = false;
    }, 700);
    return () => clearTimeout(t);
  }, [open]);

  const openAt = open === null ? -1 : work.findIndex((s) => s.slug === open);
  const shown = openAt >= 0 ? work[openAt] : null;
  const next = openAt >= 0 ? work[openAt + 1] : undefined;

  // The last stretch of an open story fills the bar; reaching the end
  // loads the next one, or after the last, carries on down the page.
  const onDetailScroll = () => {
    const el = dd.current;
    if (!el || !shown) return;
    // Just loaded: hold at the top so trackpad momentum from the last
    // story doesn't carry on into this one.
    if (advancing.current) {
      el.scrollTop = 0;
      return;
    }
    const rw = runway.current?.offsetHeight ?? 1;
    const max = el.scrollHeight - el.clientHeight;
    const pull = clamp(1 - (max - el.scrollTop) / rw, 0, 1);
    el.style.setProperty("--pull", pull.toFixed(3));
    if (pull >= 0.995) {
      advancing.current = true;
      if (next) {
        setEnter("next");
        setOpen(next.slug);
      } else {
        setOpen(null);
        requestAnimationFrame(() => document.getElementById("systems")?.scrollIntoView());
      }
    }
  };

  const onStageKey = (e: React.KeyboardEvent) => {
    if (open !== null) return;
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    const to = clamp(atRef.current + dir, 0, N - 1);
    if (to === atRef.current) return;
    e.preventDefault();
    scrollTo(to);
    discs.current[to]?.focus({ preventScroll: true });
  };

  const label = AREAS.find((a) => a.id === filter)!.label;
  const count = (id: Area | "all") => (id === "all" ? WORK.length : WORK.filter((s) => s.areas.includes(id)).length);
  const chips = (
    <div className="dg-filter" role="group" aria-label="Filter the work">
      {AREAS.map((a) => (
        <button key={a.id} type="button" aria-pressed={filter === a.id} onClick={() => choose(a.id)}>
          {a.label} <span>{count(a.id)}</span>
        </button>
      ))}
    </div>
  );
  const two = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <section
        ref={sec}
        id="prototypes"
        className="dg"
        aria-label="The work, as discs"
        style={{ "--tracks": N, "--step": `${STEP * 100}svh` } as React.CSSProperties}
      >
        <h2 id="production" className="sr-only">
          What I built: ten things I shipped and three I prototyped
        </h2>
        <div ref={stage} className="dg-stage" onKeyDown={onStageKey} inert={open !== null}>
          {chips}
          <div className="dg-info" aria-live="polite">
            {work.map((s, i) => (
              <div key={s.slug} className="dg-card" data-state={i === at ? "on" : i < at ? "past" : "next"} aria-hidden={i !== at}>
                <p className="dg-m dg-kick">
                  <span>
                    {two(i + 1)} / {two(N)} · {s.kind} · {s.product}
                  </span>
                </p>
                <p className="dg-m dg-title">
                  <span>{s.title}</span>
                </p>
                <dl className="dg-rows">
                  <div>
                    <dt className="dg-m"><span>At</span></dt>
                    <dd className="dg-m"><span>{s.at}</span></dd>
                  </div>
                  <div>
                    <dt className="dg-m"><span>When</span></dt>
                    <dd className="dg-m"><span>{s.when}</span></dd>
                  </div>
                  <div>
                    <dt className="dg-m"><span>My part</span></dt>
                    <dd className="dg-m"><span>{s.role}</span></dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <div className="dg-discs">
            {work.map((s, i) => (
              <button
                key={s.slug}
                ref={(el) => {
                  discs.current[i] = el;
                }}
                type="button"
                className="dg-disc"
                data-on={i === at || undefined}
                tabIndex={i === at ? 0 : -1}
                aria-label={i === at ? `Open: ${s.title}` : `Play: ${s.title}`}
                onClick={() => {
                  if (suppress.current) {
                    suppress.current = false;
                    return;
                  }
                  if (i === atRef.current) openStory(s.slug);
                  else scrollTo(i);
                }}
                onPointerDown={(e) => {
                  if (i !== atRef.current || e.button !== 0) return;
                  grab(handleFor(s.slug), e.currentTarget, e);
                  kick.current();
                }}
                onPointerMove={(e) => {
                  if (i !== atRef.current) return;
                  aim(handleFor(s.slug), e.currentTarget, e);
                  kick.current();
                }}
                onPointerUp={(e) => {
                  const h = handleFor(s.slug);
                  if (h.drag && h.moved > 6) suppress.current = true;
                  release(h, e.currentTarget, e.pointerType !== "mouse");
                  kick.current();
                }}
                onPointerCancel={(e) => {
                  release(handleFor(s.slug), e.currentTarget, true);
                  kick.current();
                }}
                onPointerLeave={(e) => {
                  release(handleFor(s.slug), e.currentTarget, true);
                  kick.current();
                }}
              >
                <Disc
                  story={s}
                  basePath={basePath}
                  id={`g-${s.slug}`}
                  float={i}
                  tiltRef={(el) => {
                    tilts.current[i] = el;
                  }}
                  bodyRef={(el) => {
                    bodies.current[i] = el;
                  }}
                />
              </button>
            ))}
          </div>

          <div className="dg-proof">
            {work.map((s, i) => (
              <dl key={s.slug} className="dg-proof-set" data-state={i === at ? "on" : i < at ? "past" : "next"} aria-hidden={i !== at}>
                {s.outcomes.slice(0, 2).map((o) => (
                  <div key={o.n}>
                    <dt className="dg-m"><span>{o.n}</span></dt>
                    <dd className="dg-m"><span>{o.label}</span></dd>
                  </div>
                ))}
              </dl>
            ))}
          </div>

          <div className="dg-rail" aria-hidden="true">
            <i style={{ "--at": N > 1 ? at / (N - 1) : 0 } as React.CSSProperties} />
          </div>

          <div className="dg-index" data-open={index || undefined}>
            <button type="button" className="dg-index-btn" aria-expanded={index} onClick={() => setIndex((v) => !v)}>
              Tracklist <b>{two(at + 1)}</b>/{two(N)}
            </button>
            <div className="dg-index-pop" hidden={!index}>
              <p className="dg-index-h">{label}</p>
              <ol>
                {work.map((s, i) => (
                  <li key={s.slug}>
                    <button
                      type="button"
                      aria-current={i === at || undefined}
                      onClick={() => {
                        setIndex(false);
                        scrollTo(i);
                      }}
                    >
                      <span>{two(i + 1)}</span>
                      <span>{s.title}</span>
                      <span>{s.at}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Every story is in the page; opening one shows it. */}
        <div
          ref={dd}
          className="dd"
          role="dialog"
          aria-modal={open !== null}
          aria-label={shown ? shown.title : "The work in full"}
          data-open={open !== null || undefined}
          onScroll={onDetailScroll}
        >
          {WORK.map((s) => (
            <Detail key={s.slug} story={s} basePath={basePath} active={s.slug === open} enter={enter} onClose={close} />
          ))}
          {shown && (
            <>
              <div className="dd-next">
                <p className="dd-next-kick">{next ? `Next · ${next.kind} · ${next.product}` : "Next · how the work runs"}</p>
                <p className="dd-next-title">{next ? next.title : "The checks, the agents, and the code you can read."}</p>
                <p className="dd-next-hint">
                  <span>Keep scrolling</span>
                  <i aria-hidden="true" />
                </p>
              </div>
              <div ref={runway} className="dd-runway" aria-hidden="true" />
            </>
          )}
        </div>
      </section>
    </>
  );
}

/** One printed disc: the label, its rim text, the clear hub, the shine and
 *  the pen ring, which lies in the disc's plane so it stays round it. */
function Disc({
  story,
  basePath,
  id,
  float,
  tiltRef,
  bodyRef,
}: {
  story: Story;
  basePath: string;
  id: string;
  float: number;
  tiltRef?: (el: HTMLSpanElement | null) => void;
  bodyRef?: (el: HTMLSpanElement | null) => void;
}) {
  const { look, headline } = story;
  const rim = `Elliot Little · ${story.at} · ${story.when} · ${story.kind} · ${story.product} · `;
  return (
    <span className="disc-float" style={{ "--f": float } as React.CSSProperties}>
      <span
        className="disc"
        data-art={look.art && !look.cover ? "" : undefined}
        data-cover={look.cover ? "" : undefined}
        style={
          {
            "--disc-bg": look.bg,
            "--disc-fg": look.fg,
            "--len": headline.n.length,
          } as React.CSSProperties
        }
        aria-hidden="true"
        data-i18n-skip
      >
        <span className="disc-tilt" ref={tiltRef}>
          <span className="disc-shadow" />
          <span className="disc-edge" />
          <span className="disc-body" ref={bodyRef} style={{ transform: `rotate(${baseAngle(story)}deg)` }}>
            {look.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="disc-cover" src={`${basePath}/${look.cover}`} alt="" loading="lazy" draggable={false} />
            ) : (
              look.art && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="disc-art" src={`${basePath}/${look.art}`} alt="" loading="lazy" draggable={false} />
              )
            )}
            {look.cover ? (
              // The headline as the round sticker a shop puts on the case.
              <span className="disc-sticker">
                <b>{headline.n}</b>
                {headline.label}
              </span>
            ) : (
              <span className="disc-big">
                {headline.n}
                <small>{headline.label}</small>
              </span>
            )}
            <span className="disc-name">{story.product}</span>
            <svg className="disc-rim" viewBox="0 0 100 100">
              <defs>
                <path id={`rim-${id}`} d="M50 50 m-45 0 a45 45 0 1 1 90 0 a45 45 0 1 1 -90 0" />
              </defs>
              {(look.art || look.cover) && <circle className="disc-rim-band" cx="50" cy="50" r="45.9" />}
              <text>
                <textPath href={`#rim-${id}`} textLength={280} lengthAdjust="spacing">
                  {(rim + rim).toUpperCase()}
                </textPath>
              </text>
            </svg>
          </span>
          <span className="disc-hub" />
          <span className="disc-gloss" />
          <span className="disc-spec" />
          <svg className="disc-ring" viewBox="0 0 100 100">
            <path d={RING} pathLength={1} />
          </svg>
        </span>
      </span>
    </span>
  );
}

/**
 * A story on one screen: what it is, then the problem, what we explored
 * and the outcome side by side, with the disc beside them. The disc spins
 * up as it loads, can be handled, and a prototype's disc plays its
 * recording.
 */
function Detail({
  story,
  basePath,
  active,
  enter,
  onClose,
}: {
  story: Story;
  basePath: string;
  active: boolean;
  enter: "open" | "next";
  onClose: () => void;
}) {
  const tilt = useRef<HTMLSpanElement | null>(null);
  const body = useRef<HTMLSpanElement | null>(null);
  const h = useRef<Handle>(newHandle());
  const frame = useRef(0);
  const last = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => {
    if (frame.current) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = (now: number) => {
      frame.current = 0;
      const dt = last.current ? Math.min(0.05, (now - last.current) / 1000) : 0.016;
      last.current = now;
      const moving = step(h.current, dt, still);
      if (tilt.current) tilt.current.style.transform = tiltOf(h.current);
      if (body.current) body.current.style.transform = `rotate(${(baseAngle(story) + h.current.spin).toFixed(2)}deg)`;
      if (moving) frame.current = requestAnimationFrame(tick);
      else last.current = 0;
    };
    frame.current = requestAnimationFrame(tick);
  }, [story]);

  // Loading a disc spins it up, the way a drive takes one, then it coasts.
  useEffect(() => {
    if (!active) {
      setPlaying(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    h.current.vel = enter === "open" ? 620 : 420;
    run();
  }, [active, enter, run]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* No clipboard: the address bar already has the link. */
    }
  };

  return (
    <article className="dd-art" data-active={active || undefined} aria-label={story.title}>
      {/* Back to the gallery, in the page's flow rather than floating. */}
      {active && (
        <button type="button" className="dd-back" onClick={onClose}>
          <span aria-hidden="true">←</span> All work
        </button>
      )}
      <div className="dd-text">
        <p className="dd-kick">
          {story.kind} · {story.at} · {story.when}
        </p>
        <h3 className="dd-title">{story.title}</h3>
        {story.clip && (
          <button type="button" className="dd-play" onClick={() => setPlaying(true)}>
            <span aria-hidden="true">▶</span> Play the walkthrough
          </button>
        )}
        <div className="dd-cols">
          <div>
            <span className="ws-label">Problem</span>
            <p>{story.problem}</p>
          </div>
          <div>
            <span className="ws-label">What we explored</span>
            <ul className="ws-points">
              {story.explored.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="ws-label">Outcome</span>
            <dl className="dd-proof">
              {story.outcomes.map((o) => (
                <div key={o.n}>
                  <dt>{o.n}</dt>
                  <dd>{o.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        {story.learned && (
          <p className="dd-learned">
            <span className="ws-label">What we learned</span> {story.learned}
          </p>
        )}
        <p className="dd-foot">
          <span className="ws-label">My part</span> <span>{story.role}</span>
          {story.links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label} ↗
            </a>
          ))}
          {active && (
            <button type="button" className="dd-copy" onClick={copy}>
              {copied ? "link copied" : "copy link"}
            </button>
          )}
        </p>
      </div>
      {active && (
        <div
          className="dd-disc"
          data-enter={enter}
          title={story.look.after ? `Cover after ${story.look.after}` : undefined}
          data-plays={story.clip ? "" : undefined}
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            grab(h.current, e.currentTarget, e);
            run();
          }}
          onPointerMove={(e) => {
            aim(h.current, e.currentTarget, e);
            run();
          }}
          onPointerUp={(e) => {
            const tapped = h.current.drag && h.current.moved < 6;
            release(h.current, e.currentTarget, e.pointerType !== "mouse");
            // A tap plays a prototype; on anything else it flicks the disc.
            if (tapped) {
              if (story.clip) setPlaying(true);
              else h.current.vel += 480;
            }
            run();
          }}
          onPointerCancel={(e) => {
            release(h.current, e.currentTarget, true);
            run();
          }}
          onPointerLeave={(e) => {
            release(h.current, e.currentTarget, true);
            run();
          }}
        >
          <Disc
            story={story}
            basePath={basePath}
            id={`d-${story.slug}`}
            float={0}
            tiltRef={(el) => {
              tilt.current = el;
            }}
            bodyRef={(el) => {
              body.current = el;
            }}
          />
          {story.clip && (
            <span className="dd-disc-play" aria-hidden="true">
              ▶
            </span>
          )}
        </div>
      )}
      {active && playing && story.clip && (
        <Lightbox clip={story.clip} title={story.title} basePath={basePath} onClose={() => setPlaying(false)} />
      )}
    </article>
  );
}

/**
 * The recording, full screen over everything, the way a trailer opens: the
 * chapters underneath light up as the video passes them, and a click on
 * one jumps there. Escape or Close puts you back on the story.
 */
function Lightbox({
  clip,
  title,
  basePath,
  onClose,
}: {
  clip: NonNullable<Story["clip"]>;
  title: string;
  basePath: string;
  onClose: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // This Escape is ours; the story underneath stays open.
      e.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, [onClose]);

  const onTime = () => {
    const t = video.current?.currentTime ?? 0;
    let k = 0;
    clip.chapters.forEach((c, i) => {
      if (t >= c.t) k = i;
    });
    setChapter(k);
  };

  // Portalled to the body so it sits over the masthead too.
  return createPortal(
    <div className="dd-lightbox" role="dialog" aria-modal="true" aria-label={`Walkthrough: ${title}`} onClick={onClose}>
      <div className="dd-lightbox-in" onClick={(e) => e.stopPropagation()}>
        <div className="dd-lightbox-top">
          <p>{title}</p>
          <button ref={closeRef} type="button" onClick={onClose}>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <video
          ref={video}
          src={`${basePath}/${clip.src}`}
          poster={`${basePath}/${clip.poster}`}
          autoPlay
          muted
          playsInline
          controls
          onTimeUpdate={onTime}
        />
        <div className="dd-chapters">
          {clip.chapters.map((c, i) => (
            <button
              key={c.label}
              type="button"
              aria-pressed={i === chapter}
              onClick={() => {
                const v = video.current;
                if (!v) return;
                v.currentTime = c.t;
                void v.play();
              }}
            >
              <span>{String(i + 1).padStart(2, "0")}</span> {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
