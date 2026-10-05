import { readFileSync } from "fs";
import { join } from "path";

export type Role = {
  org: string;
  logo?: string;
  url?: string;
  role?: string;
  dates?: string;
  /** Awards the company won while Elliot was there, shown as badges. */
  awards?: { name: string; note: string; year: string; href?: string }[];
  /** The proof: a skill, then what it delivered. Lit as the rail reaches it. */
  bullets: { k?: string; t: string }[];
  /** A team photo shown across the top of the role's card. */
  photo?: string;
  photoAlt?: string;
  /** CSS object-position for the photo's crop, where the default cuts faces. */
  photoPosition?: string;
  /** Where Elliot is in the photo, as fractions of the image's width and
   * height (r of its width), so a marker can be drawn round his face. */
  face?: { x: number; y: number; r: number };
  /** A reference from someone who managed Elliot there, verbatim. */
  quote?: { paras: string[]; name: string; role: string };
};

export type CareerRecord = {
  linkedin: string;
  note?: string;
  roles: Role[];
  /** Mentoring, drawn on the same kind of rail as the roles. */
  mentoring: Role[];
};

export function getRoles(): CareerRecord {
  return JSON.parse(
    readFileSync(join(process.cwd(), "data", "roles.json"), "utf-8"),
  );
}
