import type { Lang } from "./i18n";

// Elliot's spoken introductions, one per language, played from the language
// switch in the nav. Drop the recording in public/intro/ and name it here;
// a language with no entry shows no play button. The scripts to read are in
// docs/intro-scripts.md. Keep them short: about thirty seconds.
export const INTROS: Partial<Record<Lang, string>> = {
  // en: "en.m4a",
  // fr: "fr.m4a",
  // es: "es.m4a",
  // zh: "zh.m4a",
};
