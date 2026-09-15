// The three themes every label, heading, group and blurb on the site ties
// back to. Defined once so the nav, /writing and the home page cannot drift.
// The question underneath all three: what got checked, what got rejected,
// and who decided?

export type Theme = {
  id: string;
  /** Full heading, used where there is room (the /writing groups). */
  label: string;
  /** Short form for eyebrows and menu rows. */
  short: string;
  /** One-line standfirst under the heading. */
  line: string;
};

export const THEMES: Theme[] = [
  {
    id: "wrong-answers",
    label: "Shipping AI to people who can't afford it to be wrong",
    short: "wrong answers cost",
    line: "Tutors, probate, safeguarding. What changes when a hallucination has a cost the user pays.",
  },
  {
    id: "leading-while-building",
    label: "Product leadership while building",
    short: "leading while building",
    line: "Choosing the problem, staying with the code, and the job that appears when the handoff disappears.",
  },
  {
    id: "working-with-agents",
    label: "Working with agents",
    short: "working with agents",
    line: "Loops, stopping rules, and writing the fixes down so a correction outlives the session.",
  },
];

export const QUESTION =
  "What got checked, what got rejected, and who decided?";
