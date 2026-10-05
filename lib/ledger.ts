import { readFileSync } from "node:fs";
import { join } from "node:path";

export type LedgerWeek = {
  week_of: string; closed: number; captured: number; briefs: number; fallbacks: number;
  // What the system refused, from 5 Oct 2026. Older weeks don't carry these.
  ticks?: number; quiet?: number; facts_kept?: number; facts_thrown?: number;
  closes?: number; closes_withheld?: number; incidents?: number;
};
export type Ledger = { note: string; started: string; weeks: LedgerWeek[]; broke: { date: string; what: string }[] };

export function getLedger(): Ledger {
  return JSON.parse(readFileSync(join(process.cwd(), "data", "ledger.json"), "utf-8"));
}
