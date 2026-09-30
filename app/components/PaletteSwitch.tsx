"use client";

import { useEffect, useState } from "react";

/**
 * Local-only: flips the palette under review so the options can be compared
 * on the real pages. Not rendered in production builds.
 */
const OPTIONS = [
  ["current", "Current"],
  ["pen-blue", "Blue · paper hero"],
  ["pen-blue-ink", "Blue · ink hero"],
  ["pen-rust", "Rust · paper hero"],
  ["moss", "Moss"],
] as const;

export default function PaletteSwitch() {
  const [on, setOn] = useState("current");
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    setOn(document.documentElement.dataset.palette ?? "current");
    setTheme(document.documentElement.dataset.theme ?? "light");
  }, []);
  const mode = (t: string) => {
    document.documentElement.dataset.theme = t;
    localStorage.setItem("theme", t);
    setTheme(t);
  };
  const pick = (id: string) => {
    const root = document.documentElement;
    if (id === "current") {
      delete root.dataset.palette;
      localStorage.removeItem("palette");
    } else {
      root.dataset.palette = id;
      localStorage.setItem("palette", id);
    }
    setOn(id);
  };
  return (
    <div className="palette-switch" role="group" aria-label="Palette preview">
      {OPTIONS.map(([id, label]) => (
        <button key={id} type="button" aria-pressed={on === id} onClick={() => pick(id)}>
          {label}
        </button>
      ))}
      <span className="palette-switch-sep" aria-hidden="true" />
      {["light", "dark"].map((t) => (
        <button key={t} type="button" aria-pressed={theme === t} onClick={() => mode(t)}>
          {t === "light" ? "Light" : "Dark"}
        </button>
      ))}
    </div>
  );
}
