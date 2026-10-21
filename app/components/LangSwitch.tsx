"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LANGS, apply, collect, type Lang } from "@/lib/i18n";
import { INTROS } from "@/lib/intros";

const basePath = process.env.BASE_PATH || "";

/**
 * The language switch in the nav: English, French, Spanish and Chinese.
 *
 * Picking one translates the whole page in place (lib/i18n.ts) and keeps it
 * translated as you move around, because a MutationObserver re-applies the
 * dictionary to anything React renders later. Each language also has a play
 * button for a short spoken introduction, recorded by Elliot, when the file
 * for it exists (lib/intros.ts). The choice is remembered.
 */
export default function LangSwitch() {
  const [lang, setLang] = useState<Lang>("en");
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState<Lang | null>(null);
  const [progress, setProgress] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const dicts = useRef<Partial<Record<Lang, Record<string, string>>>>({});
  const current = useRef<Record<string, string>>({});
  const observer = useRef<MutationObserver | null>(null);

  const load = useCallback(async (l: Lang) => {
    if (l === "en") return {};
    if (!dicts.current[l]) {
      const res = await fetch(`${basePath}/i18n/${l}.json`);
      dicts.current[l] = res.ok ? await res.json() : {};
    }
    return dicts.current[l]!;
  }, []);

  const run = useCallback(() => {
    const ob = observer.current;
    apply(current.current);
    // Our own writes are mutations too; drop them so we don't loop.
    ob?.takeRecords();
  }, []);

  const choose = useCallback(
    async (l: Lang) => {
      const meta = LANGS.find((x) => x.code === l)!;
      const dict = await load(l);
      current.current = dict;
      document.documentElement.lang = meta.tag;
      document.documentElement.dataset.lang = l;
      document.documentElement.classList.add("lang-swap");
      run();
      window.setTimeout(() => document.documentElement.classList.remove("lang-swap"), 260);
      setLang(l);
      try {
        localStorage.setItem("lang", l);
      } catch {}
    },
    [load, run],
  );

  // Keep the page in the chosen language as React renders new content.
  useEffect(() => {
    let frame = 0;
    const ob = new MutationObserver(() => {
      if (!Object.keys(current.current).length) return;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        run();
      });
    });
    ob.observe(document.body, { childList: true, subtree: true, characterData: true });
    observer.current = ob;
    // For scripts/i18n-collect.mjs: every key the page renders, in English.
    (window as unknown as { __i18n: unknown }).__i18n = { collect };
    return () => {
      ob.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [run]);

  // The stored language, once the page has hydrated.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("lang");
    } catch {}
    const l = LANGS.find((x) => x.code === stored)?.code;
    const done = () => document.documentElement.classList.remove("i18n-pending");
    if (l && l !== "en") {
      const t = window.setTimeout(() => {
        choose(l).finally(done);
      }, 0);
      return () => window.clearTimeout(t);
    }
    done();
  }, [choose]);

  // Escape or a click outside closes the list.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  useEffect(() => () => audio.current?.pause(), []);

  function play(l: Lang) {
    const src = INTROS[l];
    if (!src) return;
    if (playing === l) {
      audio.current?.pause();
      setPlaying(null);
      return;
    }
    audio.current?.pause();
    const a = new Audio(`${basePath}/intro/${src}`);
    a.ontimeupdate = () => setProgress(a.duration ? a.currentTime / a.duration : 0);
    a.onended = () => {
      setPlaying(null);
      setProgress(0);
    };
    audio.current = a;
    setProgress(0);
    setPlaying(l);
    a.play().catch(() => setPlaying(null));
  }

  const meta = LANGS.find((x) => x.code === lang)!;

  return (
    <div className="lang" ref={box} data-i18n-skip="" translate="no">
      <button
        type="button"
        className="lang-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Language: ${meta.english}`}
        onClick={() => setOpen((o) => !o)}
      >
        <svg className="lang-globe" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17M12 3.5c2.6 2.4 3.9 5.2 3.9 8.5s-1.3 6.1-3.9 8.5M12 3.5c-2.6 2.4-3.9 5.2-3.9 8.5s1.3 6.1 3.9 8.5" />
        </svg>
        <span className="lang-code" key={lang}>
          {meta.short}
        </span>
      </button>
      {open && (
        <div className="lang-panel" role="menu" aria-label="Choose a language">
          {LANGS.map((l) => (
            <div className="lang-row" key={l.code} data-on={l.code === lang || undefined}>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={l.code === lang}
                className="lang-pick"
                lang={l.tag}
                onClick={() => {
                  choose(l.code);
                  setOpen(false);
                }}
              >
                <span className="lang-native">{l.native}</span>
                {l.code !== "en" && <span className="lang-english">{l.english}</span>}
              </button>
              {INTROS[l.code] && (
                <button
                  type="button"
                  className="lang-play"
                  data-playing={playing === l.code || undefined}
                  aria-label={
                    playing === l.code
                      ? `Stop my introduction in ${l.english}`
                      : `Play my introduction in ${l.english}`
                  }
                  title={`Hear me introduce the site in ${l.english}`}
                  onClick={() => play(l.code)}
                  style={
                    playing === l.code
                      ? ({ "--p": progress } as React.CSSProperties)
                      : undefined
                  }
                >
                  {playing === l.code ? (
                    <span className="lang-bars" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 7.5v9l7.5-4.5z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          ))}
          {meta.note && (
            <p className="lang-note" lang={meta.tag}>
              {meta.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

