import { readFileSync } from "node:fs";
import { join } from "node:path";

export type LedgerWeek = { week_of: string; closed: number; captured: number; briefs: number; fallbacks: number };
export type Ledger = { note: string; started: string; weeks: LedgerWeek[]; broke: { date: string; what: string }[] };

export function getLedger(): Ledger {
  return JSON.parse(readFileSync(join(process.cwd(), "data", "ledger.json"), "utf-8"));
}
