// The site in four languages, done on the page rather than as four copies
// of every route.
//
// The pages are written and built in English. At build time nothing
// changes. In the browser, the language switch walks the rendered page,
// turns each piece of text into a key, and swaps in the translation from
// public/i18n/<lang>.json. A "unit" is a block whose children are only text
// and inline elements (a link, an em), so a sentence with a link in it is
// translated as one sentence: its key is the text with each inline element
// marked <0>…</0>, and the translation carries the same markers in the same
// order. The translated words are written back into the existing text nodes,
// never by rebuilding elements, so React keeps the nodes it owns.
//
// The same key function feeds scripts/i18n-collect.mjs (through
// window.__i18n.collect), so what gets translated is exactly what renders.

export type Lang = "en" | "fr" | "es" | "zh";

export const LANGS: {
  code: Lang;
  /** The language's name in itself. */
  native: string;
  /** Its name in English, for screen readers and the audio label. */
  english: string;
  /** What the nav shows when this language is on. */
  short: string;
  /** BCP 47 tag for <html lang>. */
  tag: string;
  /** Small print under the list, in that language. */
  note: string;
}[] = [
  { code: "en", native: "English", english: "English", short: "EN", tag: "en", note: "" },
  { code: "fr", native: "Français", english: "French", short: "FR", tag: "fr", note: "Traduction automatique" },
  { code: "es", native: "Español", english: "Spanish", short: "ES", tag: "es", note: "Traducción automática" },
  { code: "zh", native: "中文", english: "Chinese", short: "中", tag: "zh-Hans", note: "机器翻译" },
];

const SKIP = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "CODE", "PRE", "SVG", "TEXTAREA",
  "INPUT", "SELECT", "OPTION", "IFRAME", "CANVAS", "VIDEO", "AUDIO", "KBD",
]);
const INLINE = new Set([
  "A", "EM", "STRONG", "B", "I", "SPAN", "ABBR", "SMALL", "TIME", "SUP", "SUB",
  "U", "MARK", "Q", "CITE",
]);
const ATTRS = ["alt", "aria-label", "title", "placeholder"] as const;
const LETTER = /\p{L}/u;
const TAG = /(<\/?\d+>)/;

// Each text node we write to remembers its English (o) and what we set (s).
// If React has since written new English over it, the value no longer
// matches s, and that new value becomes the original.
type Tracked = Text & { __o?: string; __s?: string };

function orig(t: Tracked): string {
  const v = t.nodeValue ?? "";
  if (t.__s !== undefined && v === t.__s) return t.__o ?? v;
  t.__o = v;
  t.__s = undefined;
  return v;
}

function skipped(el: Element): boolean {
  return (
    SKIP.has(el.tagName.toUpperCase()) ||
    el.getAttribute("translate") === "no" ||
    el.hasAttribute("data-i18n-skip")
  );
}

// Inline by tag and by how it actually renders: a span laid out as a block
// or an inline-block (a card row, an animated word) is structure, not part
// of a sentence.
function inline(el: Element): boolean {
  if (!INLINE.has(el.tagName.toUpperCase()) || skipped(el) || el.hasAttribute("data-i18n-words"))
    return false;
  return getComputedStyle(el).display === "inline";
}

function inlineOnly(el: Element): boolean {
  for (const c of Array.from(el.childNodes)) {
    if (c.nodeType === 1) {
      const e = c as Element;
      if (!inline(e) || !inlineOnly(e)) return false;
    }
  }
  return true;
}

// A unit is a sentence-like block (segments split at inline markers), or a
// headline animated word by word (Reveal's Words and RiseWords mark their
// container with data-i18n-words): one key for the whole line, with the
// translated words shared back out across the word spans.
type Unit =
  | { key: string; segments: Tracked[][]; words?: undefined }
  | { key: string; words: Tracked[]; segments?: undefined };

function wordsUnit(el: Element): Unit | null {
  const nodes: Tracked[] = [];
  const walk = (n: Node) => {
    for (const c of Array.from(n.childNodes)) {
      if (c.nodeType === 3) nodes.push(c as Tracked);
      else if (c.nodeType === 1) walk(c);
    }
  };
  walk(el);
  const key = norm(nodes.map(orig).join(""));
  return LETTER.test(key) ? { key, words: nodes } : null;
}

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

function unitFromElement(el: Element): Unit | null {
  let key = "";
  const segments: Tracked[][] = [[]];
  let n = 0;
  const walk = (node: Element) => {
    for (const c of Array.from(node.childNodes)) {
      if (c.nodeType === 3) {
        key += orig(c as Tracked);
        segments[segments.length - 1].push(c as Tracked);
      } else if (c.nodeType === 1) {
        const i = n++;
        key += `<${i}>`;
        segments.push([]);
        walk(c as Element);
        key += `</${i}>`;
        segments.push([]);
      }
    }
  };
  walk(el);
  key = norm(key);
  return LETTER.test(key.replace(TAG, "")) ? { key, segments } : null;
}

function units(root: Element, out: Unit[]) {
  for (const c of Array.from(root.childNodes)) {
    if (c.nodeType === 3) {
      const key = norm(orig(c as Tracked));
      if (LETTER.test(key)) out.push({ key, segments: [[c as Tracked]] });
    } else if (c.nodeType === 1) {
      const el = c as Element;
      if (skipped(el)) continue;
      if (el.hasAttribute("data-i18n-words")) {
        const u = wordsUnit(el);
        if (u) out.push(u);
      } else if (inlineOnly(el) && LETTER.test(el.textContent ?? "")) {
        const u = unitFromElement(el);
        if (u) out.push(u);
      } else {
        units(el, out);
      }
    }
  }
}

function attrTargets(root: Element): Element[] {
  return Array.from(root.querySelectorAll(ATTRS.map((a) => `[${a}]`).join(","))).filter(
    (el) => !el.closest("[data-i18n-skip],[translate='no']"),
  );
}

// Original attribute values, so a switch back to English restores them.
const attrOrig = new WeakMap<Element, Record<string, { o: string; s?: string }>>();

function attrOriginal(el: Element, a: string): string | null {
  const v = el.getAttribute(a);
  if (v === null) return null;
  const rec = attrOrig.get(el) ?? {};
  const prev = rec[a];
  if (prev && prev.s !== undefined && v === prev.s) return prev.o;
  rec[a] = { o: v };
  attrOrig.set(el, rec);
  return v;
}

/** Every key on the page right now, in English. */
export function collect(root: Element = document.body): string[] {
  const out: Unit[] = [];
  units(root, out);
  const keys = new Set(out.map((u) => u.key));
  for (const el of attrTargets(root)) {
    for (const a of ATTRS) {
      const v = attrOriginal(el, a);
      if (v && LETTER.test(v)) keys.add(norm(v));
    }
  }
  if (LETTER.test(document.title)) keys.add(norm(titleOriginal()));
  return Array.from(keys);
}

let docTitle: { o: string; s?: string } | null = null;
function titleOriginal(): string {
  const v = document.title;
  if (docTitle && docTitle.s !== undefined && v === docTitle.s) return docTitle.o;
  docTitle = { o: v };
  return v;
}

const touched = new Set<Tracked>();

function set(node: Tracked, v: string) {
  if (node.__o === undefined) node.__o = node.nodeValue ?? "";
  node.nodeValue = v;
  node.__s = v;
  touched.add(node);
}

function writeWords(nodes: Tracked[], t: string) {
  const words = nodes.filter((n) => /\S/.test(orig(n)));
  const gaps = nodes.filter((n) => !/\S/.test(orig(n)));
  if (!words.length) return;
  const spaced = /\s/.test(t.trim());
  if (!spaced) {
    // Chinese has no spaces: the whole line goes in the first word.
    words.forEach((n, i) => set(n, i === 0 ? t : ""));
    gaps.forEach((n) => set(n, ""));
    return;
  }
  const tokens = t.trim().split(/\s+/);
  words.forEach((n, i) => {
    const tail = /\s$/.test(orig(n)) ? " " : "";
    const w =
      i < words.length - 1 ? tokens[i] ?? "" : tokens.slice(words.length - 1).join(" ");
    set(n, w ? w + tail : "");
  });
}

function writeUnit(u: Unit, t: string): boolean {
  if (u.words) {
    writeWords(u.words, t);
    return true;
  }
  const kParts = u.key.split(TAG);
  const tParts = t.split(TAG);
  const kTags = kParts.filter((_, i) => i % 2);
  const tTags = tParts.filter((_, i) => i % 2);
  if (kTags.join() !== tTags.join()) return false;
  const texts = tParts.filter((_, i) => i % 2 === 0);
  if (texts.length !== u.segments.length) return false;

  const all = u.segments.flat();
  if (!all.length) return false;
  const first = all[0];
  const last = all[all.length - 1];
  const lead = (first.__s !== undefined ? first.__o : first.nodeValue)?.match(/^\s*/)?.[0] ?? "";
  const trail = (last.__s !== undefined ? last.__o : last.nodeValue)?.match(/\s*$/)?.[0] ?? "";

  let carry = "";
  let lastWritten: Tracked | null = null;
  texts.forEach((text, i) => {
    const nodes = u.segments[i];
    let value = carry + text;
    carry = "";
    if (!nodes.length) {
      // No text node here in the English (say the sentence started with a
      // link), but the translation puts words here: hand them on.
      if (value) {
        if (lastWritten) {
          lastWritten.nodeValue += value;
          lastWritten.__s = lastWritten.nodeValue ?? "";
        } else carry = value;
      }
      return;
    }
    if (i === 0) value = lead + value.trimStart();
    if (i === texts.length - 1) value = value.trimEnd() + trail;
    nodes.forEach((node, j) => set(node, j === 0 ? value : ""));
    lastWritten = nodes[0];
  });
  return true;
}

/** Puts the page into `dict`'s language. An empty dict restores English. */
export function apply(dict: Record<string, string>, root: Element = document.body) {
  // Back to English first, so every key is read from the original.
  restore();
  if (!Object.keys(dict).length) return;
  const out: Unit[] = [];
  units(root, out);
  for (const u of out) {
    const t = dict[u.key];
    if (t) writeUnit(u, t);
  }
  for (const el of attrTargets(root)) {
    for (const a of ATTRS) {
      const v = attrOriginal(el, a);
      if (!v) continue;
      const t = dict[norm(v)];
      if (t) {
        el.setAttribute(a, t);
        attrOrig.get(el)![a].s = t;
      }
    }
  }
  const title = titleOriginal();
  const tt = dict[norm(title)];
  if (tt) {
    document.title = tt;
    docTitle!.s = tt;
  }
}

/** Puts every text node and attribute we changed back to its English. */
export function restore() {
  for (const node of touched) {
    if (node.__s !== undefined && node.nodeValue === node.__s) node.nodeValue = node.__o ?? "";
    node.__s = undefined;
  }
  touched.clear();
  document.querySelectorAll(ATTRS.map((a) => `[${a}]`).join(",")).forEach((el) => {
    const rec = attrOrig.get(el);
    if (!rec) return;
    for (const a of Object.keys(rec)) {
      const r = rec[a];
      if (r.s !== undefined && el.getAttribute(a) === r.s) el.setAttribute(a, r.o);
      r.s = undefined;
    }
  });
  if (docTitle?.s !== undefined && document.title === docTitle.s) document.title = docTitle.o;
  if (docTitle) docTitle.s = undefined;
}
