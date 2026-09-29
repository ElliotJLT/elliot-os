import { readFileSync } from "fs";
import { join } from "path";

export type Role = {
  org: string;
  logo?: string;
  url?: string;
  role?: string;
  dates?: string;
  /** The proof, one line each, drawn in as the rail reaches them. */
  bullets: string[];
  /** A team photo shown across the top of the role's card. */
  photo?: string;
  photoAlt?: string;
  /** A reference from someone who managed Elliot there, verbatim. */
  quote?: { paras: string[]; name: string; role: string };
};

export type CareerRecord = {
  linkedin: string;
  note?: string;
  roles: Role[];
};

export function getRoles(): CareerRecord {
  return JSON.parse(
    readFileSync(join(process.cwd(), "data", "roles.json"), "utf-8"),
  );
}
