// Translates the site's text (i18n/source.json, from i18n-collect.mjs) into
// French, Spanish and Simplified Chinese, writing public/i18n/<lang>.json.
//
//   npm run i18n:translate          # only keys that are new or missing
//   npm run i18n:translate -- fr    # one language
//
// Only what's missing is sent, so a copy change costs a few strings, not the
// site. Keys that no longer render are dropped. Each key may carry inline
// markers like <0>…</0> (a link or emphasis inside a sentence); a
// translation is kept only if it has the same markers in the same order,
// otherwise that string is retried once on its own and then left in English.
//
// Runs on Claude Sonnet 5.5: translation is execution work, so it goes to the
// cheaper model. Needs ANTHROPIC_API_KEY (or an `ant auth login` profile).

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-5-5";
const BATCH = 40;
const PARALLEL = 4;

const LANGUAGES = {
  fr: {
    name: "French",
    notes:
      "France French. Natural, plain, professional; the way a French product leader would write about their own work. Use « » only if the English has quotation marks. A non-breaking space before : ; ! ? is fine to omit.",
  },
  es: {
    name: "Spanish",
    notes: "Neutral international Spanish, readable in Spain and Latin America. Plain and professional.",
  },
  zh: {
    name: "Simplified Chinese",
    notes:
      "Simplified Chinese for mainland readers. Full-width punctuation. Concise, professional, not literal; keep it reading like a person describing their own work.",
  },
};

const KEEP = [
  "Elliot Little", "Elliot", "Zero Gravity", "Farewill", "Flash Pack", "MealsForTheNHS",
  "ward", "crux", "boulot", "argus", "Claude", "Claude Code", "Opus", "Sonnet", "MCP",
  "GitHub", "Medium", "LinkedIn", "Lenny's Newsletter", "Teresa Torres", "Just Now Possible",
  "KCSIE", "DfE", "HMCTS", "HMRC", "NHS", "ISO 27001", "AQA", "Edexcel", "OCR", "IB", "GCSE",
  "A-level", "HSBC", "Morgan Stanley", "KPMG", "Accenture", "Snap", "Ashurst", "Mercedes-AMG F1",
  "HubSpot", "Zapier", "Notion", "Airtable", "Intercom", "Pearson", "ElevenLabs", "BlueDot Impact",
  "llms.txt", "Telegram", "Career Co-pilot",
];

function system(lang) {
  const L = LANGUAGES[lang];
  return `You translate the text of Elliot Little's personal website into ${L.name}.

Elliot is a product leader in London who builds AI products for people who can't afford a wrong answer: an AI tutor used in UK schools, safeguarding for apps children use, probate for grieving families. The site is first person, plain and specific, with no hype. Readers are hiring managers, founders and government fellowship reviewers.

How to translate:
- Each item is one piece of the page: a sentence, a paragraph, a heading, a button, a nav label, alt text, or a page title. Translate it so it reads naturally on its own in ${L.name}.
- Keep the meaning exact. Never add, drop, soften or strengthen a claim. Numbers, percentages, money, dates and counts stay exactly as written (localise only the number format if the language needs it).
- Keep first person as first person. Keep the register plain; no marketing phrasing.
- Short UI labels stay short. If the English is lowercase as a style (a nav word, an eyebrow), keep it lowercase where the script has case.
- Markers like <0>, </0>, <1>, </1> wrap a link or emphasis inside the sentence. Every marker must appear exactly once in your translation, in the same order as in the English, wrapping the words that correspond. Keep spaces around markers as ${L.name} needs them.
- Leave these untranslated: ${KEEP.join(", ")}; people's names; code, file paths, URLs and email addresses.
- If an item is only a name, a code or a number, return it unchanged.
- ${L.notes}

Return every item, with the same id.`;
}

const SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: { id: { type: "integer" }, text: { type: "string" } },
        required: ["id", "text"],
        additionalProperties: false,
      },
    },
  },
  required: ["items"],
  additionalProperties: false,
};

const tags = (s) => (s.match(/<\/?\d+>/g) || []).join(",");

const client = new Anthropic();

async function translate(lang, strings) {
  const res = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: SCHEMA },
    },
    system: [{ type: "text", text: system(lang), cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: JSON.stringify(strings.map((text, id) => ({ id, text }))),
      },
    ],
  });
  if (res.stop_reason === "refusal") throw new Error(`refused: ${res.stop_details?.category ?? "?"}`);
  if (res.stop_reason === "max_tokens") throw new Error("ran out of tokens; lower BATCH");
  const text = res.content.find((b) => b.type === "text")?.text ?? "{}";
  const out = new Map();
  for (const { id, text: t } of JSON.parse(text).items ?? []) out.set(id, t);
  return { out, usage: res.usage };
}

async function pool(tasks, n) {
  const results = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < tasks.length) {
        const k = i++;
        results[k] = await tasks[k]();
      }
    }),
  );
  return results;
}

const source = JSON.parse(await readFile("i18n/source.json", "utf8"));
const only = process.argv.slice(2).filter((a) => LANGUAGES[a]);
const langs = only.length ? only : Object.keys(LANGUAGES);
await mkdir("public/i18n", { recursive: true });

let tokensIn = 0;
let tokensOut = 0;

for (const lang of langs) {
  const file = `public/i18n/${lang}.json`;
  const old = existsSync(file) ? JSON.parse(await readFile(file, "utf8")) : {};
  const dict = {};
  for (const k of source) if (old[k]) dict[k] = old[k];
  const missing = source.filter((k) => !dict[k]);
  console.log(`${lang}: ${Object.keys(dict).length} kept, ${missing.length} to translate`);

  const batches = [];
  for (let i = 0; i < missing.length; i += BATCH) batches.push(missing.slice(i, i + BATCH));
  const failed = [];
  await pool(
    batches.map((batch, b) => async () => {
      try {
        const { out, usage } = await translate(lang, batch);
        tokensIn += (usage.input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0) + (usage.cache_creation_input_tokens ?? 0);
        tokensOut += usage.output_tokens ?? 0;
        batch.forEach((k, id) => {
          const t = out.get(id);
          if (t && tags(t) === tags(k)) dict[k] = t;
          else failed.push(k);
        });
        console.log(`  ${lang} batch ${b + 1}/${batches.length} done`);
      } catch (e) {
        if (e instanceof Anthropic.AuthenticationError || /authentication method/i.test(e.message)) {
          console.error("No usable Anthropic credentials (ANTHROPIC_API_KEY or `ant auth login`).");
          process.exit(1);
        }
        console.warn(`  ${lang} batch ${b + 1} failed: ${e.message}`);
        failed.push(...batch);
      }
    }),
    PARALLEL,
  );

  // One more go, one at a time, for anything that came back wrong.
  const still = [];
  for (const k of failed) {
    try {
      const { out } = await translate(lang, [k]);
      const t = out.get(0);
      if (t && tags(t) === tags(k)) dict[k] = t;
      else still.push(k);
    } catch {
      still.push(k);
    }
  }
  if (still.length) console.warn(`  ${lang}: ${still.length} left in English:`, still.slice(0, 5));

  // Chinese: full-width punctuation next to Chinese characters, whatever the
  // model returned.
  if (lang === "zh") {
    const cjk = "[\\u3400-\\u9fff\\uff00-\\uffef]";
    for (const k of Object.keys(dict)) {
      dict[k] = dict[k]
        .replace(new RegExp(`(?<=${cjk}),\\s*`, "g"), "，")
        .replace(new RegExp(`,\\s*(?=${cjk})`, "g"), "，")
        .replace(new RegExp(`(?<=${cjk});\\s*`, "g"), "；")
        .replace(new RegExp(`(?<=${cjk}):\\s*(?=${cjk})`, "g"), "：");
    }
  }
  const sorted = Object.fromEntries(Object.keys(dict).sort().map((k) => [k, dict[k]]));
  await writeFile(file, JSON.stringify(sorted, null, 1) + "\n");
  console.log(`${lang}: wrote ${Object.keys(sorted).length} strings to ${file}`);
}

console.log(`Tokens: ${tokensIn} in, ${tokensOut} out (${MODEL}).`);
