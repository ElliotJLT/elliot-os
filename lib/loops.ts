import { readFileSync } from "fs";
import { join } from "path";

export type Proposal = {
  date: string;
  status: string;
  source: string;
  title: string;
  rationale: string;
  files?: string[];
  change?: string;
  pr_url?: string;
};

export type Loop = {
  id: string;
  name: string;
  surface: string;
  layer: "inner" | "outer";
  cadence: string;
  gate: string;
  status: "running" | "armed" | "paused";
  stop_rule: string;
  last_run: string | null;
  runs: number;
  spend_usd: number;
  note: string;
  proposals: Proposal[];
};

export type Loops = { updated: string; loops: Loop[] };

export function getLoops(): Loops {
  return JSON.parse(
    readFileSync(join(process.cwd(), "data", "loops.json"), "utf-8"),
  );
}
