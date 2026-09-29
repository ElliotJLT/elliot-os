"use client";

import { useEffect, useState } from "react";

/**
 * Local-only: flips the palette under review so the options can be compared
 * on the real pages. Not rendered in production builds.
 */
const OPTIONS = [
  ["current", "Current"],
  ["pen-blue", "Pen · blue-black"],
  ["pen-rust", "Pen · rust"],
  ["moss", "Moss"],
] as const;

export default function PaletteSwitch() {
  const [on, setOn] = useState("current");
  useEffect(() => setOn(document.documentElement.dataset.palette ?? "current"), []);
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
    </div>
  );
}
