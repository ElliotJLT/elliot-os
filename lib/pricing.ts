import { readFileSync } from "fs";
import { join } from "path";

export type Pricing = {
  checked: string;
  source: string;
  note: string;
  models: Record<string, { input: number; output: number }>;
};

export function getPricing(): Pricing {
  return JSON.parse(
    readFileSync(join(process.cwd(), "data", "pricing.json"), "utf-8"),
  );
}
