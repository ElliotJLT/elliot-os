import { readFileSync } from "fs";
import { join } from "path";

// Written by scripts/listening.mjs from the Spotify export. Aggregates only:
// the raw export never enters the repo.

export type Record = {
  slug: string;
  artist: string;
  title: string;
  /** Unbroken runs covering three quarters of the album or more. */
  throughs: number;
  hours: number;
  first: string;
  track: string;
  trackId: string;
  trackPlays: number;
  cover: string | null;
};

export type Listening = {
  from: string;
  to: string;
  hours: number;
  plays: number;
  artists: number;
  skipShare: number;
  first: { artist: string; track: string; date: string };
  firstStillTop: string | null;
  topTrack: { artist: string; track: string; plays: number };
  topArtists: { artist: string; hours: number }[];
  shelf: Record[];
  years: { year: string; hours: number; artist: string; artistHours: number }[];
  hourly: { hour: number; hours: number; artist: string | null }[];
};

export function getListening(): Listening {
  return JSON.parse(
    readFileSync(join(process.cwd(), "data", "listening.json"), "utf-8"),
  );
}

export function longDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
