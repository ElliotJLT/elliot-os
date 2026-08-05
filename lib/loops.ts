import { readFileSync } from "fs";
import { join } from "path";

export type EvalRecord = {
  score: number;
  verdict: string;
  checks: { name: string; pass: boolean }[];
  critique: string | null;
  by: string;
};

export type Proposal = {
  date: string;
  status: string;
  source: string;
  title: string;
  rationale: string;
  files?: string[];
  change?: string;
  pr_url?: string;
  shipped?: string;
  eval?: EvalRecord;
};

export type Loop = {
  id: string;
  name: string;
  surface: string;
  cadence: string;
  gate: string;
  status: "healthy" | "dormant" | "paused";
  stop_rule: string;
  last_run: string | null;
  runs: number;
  spend_usd: number;
  note: string;
  proposals: Proposal[];
};

export type Decision = {
  date: string;
  system: string;
  outcome: "accepted" | "edited" | "rejected" | "no-op";
  title: string;
  human_decision: string;
  evidence_url?: string;
};

export type Failure = {
  date: string;
  system: string;
  title: string;
  effect: string;
  change: string;
  status: "repaired" | "open";
  evidence_url?: string;
};

export type Loops = {
  updated: string;
  loops: Loop[];
  decisions: Decision[];
  failures: Failure[];
};

export function getLoops(): Loops {
  return JSON.parse(
    readFileSync(join(process.cwd(), "data", "loops.json"), "utf-8"),
  );
}
