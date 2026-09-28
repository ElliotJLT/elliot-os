/**
 * Line icons for the /evals habits. One stroke weight, no fills, drawn in
 * currentColor so the theme and the stylesheet decide the ink. Decorative:
 * the habit's heading already says what the icon shows.
 */
const PATHS: Record<string, string> = {
  // a ruler: somebody else's bar
  bar: "M3 8.5h18v7H3z M7 8.5v3 M11 8.5v4 M15 8.5v3 M19 8.5v2",
  // a balance: which way it's allowed to fail
  balance:
    "M12 4v16 M8 20h8 M5 7h14 M5 7l-2.5 6h5z M19 7l-2.5 6h5z M2.5 13a2.5 2 0 0 0 5 0 M16.5 13a2.5 2 0 0 0 5 0",
  // a speech bubble with a tick: the conversation gets marked
  conversation: "M4 5h16v10.5H10l-4 3.5v-3.5H4z M9 10.5l2 2 4-4",
  // lines of text under a magnifier: reading the transcripts
  transcript:
    "M4 5h11 M4 9h8 M4 13h5 M16 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M18.5 17l2.5 3",
  // a flag: a complaint becomes a case
  flag: "M6 21V4 M6 4.5h11l-2.2 4 2.2 4H6",
  // a circled cross: the suite you're still failing
  failing: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M9.2 9.2l5.6 5.6 M14.8 9.2l-5.6 5.6",
};

export default function HabitIcon({ name }: { name: keyof typeof PATHS }) {
  return (
    <svg
      className="habit-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={PATHS[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
