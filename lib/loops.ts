import { readFileSync } from "fs";
import { join } from "path";

export type EvalRecord = {
  score: number;
  verdict: string;
  checks: { name: string; pass: boolean }[];
  critique: string | null;
  by: string;
};

export type Check = { name: string; pass: boolean };

export type Proposal = {
  date: string;
  /** "proposed" once it clears the gate, "held" when the gate rejected it. */
  status: string;
  source: string;
  title: string;
  rationale: string;
  files?: string[];
  change?: string;
  pr_url?: string;
  shipped?: string;
  /** Which version of the logic and the prompt produced this. */
  impl_version?: string;
  prompt_version?: string;
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
  /** Authority map, kept here rather than in the page so the two cannot drift. */
  reads?: string;
  may_change?: string;
  human_boundary?: string;
  /**
   * Whether a stranger can check this row. "public" means the source and the
   * eval suite are open; "private" means it is testimony. The distinction is
   * the point of the list: a wall of unverifiable claims about private agents
   * is weaker than one loop somebody can audit.
   */
  evidence?: "public" | "private";
  /** Runs against the golden set and publishes a full trace. */
  audited?: boolean;
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
