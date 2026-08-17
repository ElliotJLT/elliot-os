import { readFileSync } from "fs";
import { join } from "path";

export type Role = {
  org: string;
  logo?: string;
  url?: string;
  role?: string;
  dates?: string;
  outcome: string;
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
