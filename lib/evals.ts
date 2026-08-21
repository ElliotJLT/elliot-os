import { readFileSync } from "fs";
import { join } from "path";

export type EvalRun = {
  date: string;
  impl_version: string;
  prompt_version: string;
  digest_version?: string;
  passed: number;
  total: number;
  failing: string[];
};

export type Evals = {
  updated: string | null;
  suite: string;
  note: string;
  runs: EvalRun[];
};

export function getEvals(): Evals {
  return JSON.parse(
    readFileSync(join(process.cwd(), "data", "evals.json"), "utf-8"),
  );
}

export type EvalCase = { id: string; kind: string; why: string };

/**
 * The golden set's own descriptions, parsed from the case files so the page
 * cannot drift from the suite. Each case carries a `why`: a case whose purpose
 * isn't written down is one nobody can argue with.
 */
export function getCases(): EvalCase[] {
  const cases: EvalCase[] = [];
  for (const file of ["cases.mjs", "shipping-cases.mjs"]) {
    const src = readFileSync(join(process.cwd(), "evals", file), "utf-8");
    for (const m of src.matchAll(
      /id:\s*"([^"]+)",\s*\n\s*kind:\s*"([^"]+)",\s*\n\s*why:\s*((?:"[^"]*"\s*\+?\s*)+)/g,
    )) {
      const why = [...m[3].matchAll(/"([^"]*)"/g)].map((s) => s[1]).join("");
      cases.push({ id: m[1], kind: m[2], why: why.trim() });
    }
  }
  return cases;
}
