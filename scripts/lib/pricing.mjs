// One dated pricing table, read from data/pricing.json.
//
// The rates used to live as a hardcoded PRICE_PER_MTOK in two scripts, with a
// comment admitting they were cached in 2026-05 and should be verified "if the
// numbers on the site start mattering". The moment an API key is added the
// numbers start mattering, in public, so: tokens are recorded as ground truth,
// dollars are derived from this one file, and the file carries the date it was
// last checked so a stale rate is visible rather than silent.

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export const PRICING = JSON.parse(
  readFileSync(join(ROOT, "data", "pricing.json"), "utf-8"),
);

/** USD for a usage object, or 0 when the model is unknown to the table. */
export function costOf(model, usage) {
  if (!usage || !model) return 0;
  const rate = PRICING.models[model];
  if (!rate) return 0;
  return +(
    ((usage.input_tokens || 0) / 1e6) * rate.input +
    ((usage.output_tokens || 0) / 1e6) * rate.output
  ).toFixed(6);
}
