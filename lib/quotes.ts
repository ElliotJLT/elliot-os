import { readFileSync } from "fs";
import { join } from "path";

export type Reference = {
  name: string;
  role: string;
  note: string;
  url: string;
  pull: string;
  body: string[];
};

export type Reader = { quote: string; who: string };

export function getQuotes(): { reference: Reference; readers: Reader[] } {
  return JSON.parse(
    readFileSync(join(process.cwd(), "data", "quotes.json"), "utf-8"),
  );
}
