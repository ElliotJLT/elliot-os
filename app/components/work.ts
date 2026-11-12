/**
 * Everything on /built as discs (DiscGallery.tsx). Each disc is one story:
 * the problem, what we explored, and the outcome. Shipped work first, then
 * the prototypes, then the operations it grew out of.
 *
 * Every number here is Elliot's and on the public site already, or from his
 * own retro in Boulot. Don't add, round or reword one without asking him.
 */

export type Area = "ai" | "safety" | "gtm" | "ops" | "prototype";

/** The filters a hiring reader picks from, with the hash each answers to. */
export const AREAS: { id: Area | "all"; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "ai", label: "AI products" },
  { id: "safety", label: "Safety and trust" },
  { id: "gtm", label: "Growth and GTM" },
  { id: "ops", label: "Operations" },
  { id: "prototype", label: "Prototypes" },
];

/** How a disc is printed: two colours from the site palette, and a photo
 *  where one belongs to the work. A photo prints as a duotone from fg to
 *  bg, so photo discs keep a light bg. */
export type Look = {
  bg: string;
  fg: string;
  art?: string;
  /** A full-colour cover made for the disc (scripts/gen-covers.mjs), and
   *  the album it borrows from, credited on the open story. */
  cover?: string;
  after?: string;
  /** Hours of that artist in Elliot's Spotify history, 2011 to 2025. */
  hours?: number;
};

export type Story = {
  slug: string;
  kind: "Shipped" | "Prototype";
  /** Printed on the disc. */
  product: string;
  /** What I did, in a line. The headline everywhere the disc is named. */
  title: string;
  at: string;
  when: string;
  areas: Area[];
  /** The disc's artwork: a number or phrase, and what it counts. */
  headline: { n: string; label: string };
  problem: string;
  /** What we tried, including what we ruled out. Three points at most. */
  explored: string[];
  outcomes: { n: string; label: string }[];
  learned?: string;
  role: string;
  links: { label: string; href: string }[];
  look: Look;
  /** A recording of it running, with the moments worth jumping to. */
  clip?: { src: string; poster: string; chapters: { label: string; t: number }[] };
  /** Screens from the shipped app, in the order a student meets them. */
  shots?: { src: string; label: string }[];
};

const STORIES: Omit<Story, "slug">[] = [
  {
    kind: "Shipped",
    product: "AI STEM tutor",
    title: "Took an AI tutor from a 30-school beta to 850+ UK schools",
    at: "Zero Gravity",
    when: "2026",
    areas: ["ai"],
    headline: { n: "30 → 850+", label: "schools" },
    problem:
      "Students without a tutor at home get stuck on their own. A general chatbot just hands them the answer.",
    explored: [
      "Separate agents for coaching, practice, marking and assignments, each checked by its own evaluator, across Maths, Physics, Chemistry and Biology for AQA, Edexcel, OCR and IB.",
      "Red-teamed the biggest risk, a student talking the tutor into giving the answer away, then put a pass/fail judge on every session.",
      "Four agents read every production trace overnight. That replaced a planned ops hire and produced half the evidence for the company retro.",
    ],
    outcomes: [
      { n: "30 → 850+", label: "schools, from the beta to the national programme" },
      { n: "67% → 99%+", label: "marking on the golden set: bare model, then the syllabus we covered" },
      { n: "33% → 65%", label: "Socratic pass rate, doubled in two weeks, graded on every session" },
      { n: "50,000+", label: "tutoring sessions" },
    ],
    learned:
      "Production ran 4.6x over the cost plan. We cut it without losing quality: prompt caching, the right model for each task, and Opus kept for marking. Next, the Pioneers pilot measures what it does for pupils' grades.",
    role: "Led product, a designer and six product engineers, each owning a problem from prototype to production, and wrote 28% of the commits",
    links: [
      { label: "view the product", href: "https://www.zerogravity.co.uk/tutor" },
      { label: "App Store", href: "https://apps.apple.com/gb/app/zero-gravity-tutor/id6760364095" },
    ],
    look: { bg: "#f3df98", fg: "#22543a", art: "work/tutor.jpg", cover: "work/covers/ai-stem-tutor.jpg", after: "OK Computer, Radiohead", hours: 101 },
    shots: [
      { src: "work/tutor/01.webp", label: "Ask anything" },
      { src: "work/tutor/02.webp", label: "Jump back in" },
      { src: "work/tutor/03.webp", label: "The lesson" },
      { src: "work/tutor/04.webp", label: "The quiz" },
    ],
  },
  {
    kind: "Shipped",
    product: "Tutor safety",
    title: "Cut false safeguarding alarms by 97% without missing a disclosure",
    at: "Zero Gravity",
    when: "2026",
    areas: ["safety", "ai"],
    headline: { n: "2nd of 8", label: "in the DfE programme" },
    problem:
      "Harris Federation's AI lead was clear: no school would put the tutor in front of students until staff could see what was happening and safeguarding was built in.",
    explored: [
      "Shipped safeguarding detection first, set to over-flag, with the school's designated safeguarding lead making every call.",
      "Then split misbehaviour from real safeguarding concerns, so the lead is only alerted when it matters.",
      "Built to the DfE's safety standards for AI used by under-18s: session limits, never posing as a human, and concerns sent to a named person.",
    ],
    outcomes: [
      { n: "97%", label: "fewer false safeguarding alarms, with no disclosure missed" },
      { n: "2nd of 8", label: "in the DfE's AI Tutoring Tools Pioneers Programme, picked from 53 bids" },
      { n: "450,000", label: "disadvantaged pupils a year the programme can reach" },
    ],
    role: "Led product, including the safety work",
    links: [{ label: "trust and safeguarding", href: "https://www.zerogravity.co.uk/tutor/trust" }],
    look: { bg: "#8e2f4f", fg: "#ecebe7", cover: "work/covers/tutor-safety.jpg", after: "A Deeper Understanding, The War On Drugs", hours: 98 },
  },
  {
    kind: "Shipped",
    product: "School hub",
    title: "Got 91% activation by rolling the tutor out through teachers",
    at: "Zero Gravity",
    when: "2026",
    areas: ["gtm", "ai"],
    headline: { n: "91%", label: "activation, teacher-led" },
    problem:
      "Teachers set one piece of homework for a whole class and only find out who was stuck when they mark it. Students rarely go looking for help on their own.",
    explored: [
      "Harris told us the way into the curriculum was through teachers, so we built for them first.",
      "Homework generated from the teacher's own material, after a head of maths told us typing in mark schemes took too long.",
      "A weekly summary for each class, safeguarding flags that go only to named staff, and a DPIA written before any data lead asks for one.",
    ],
    outcomes: [
      { n: "91% vs 23%", label: "activation when teachers lead it, against students signing up alone" },
      { n: "850+", label: "UK schools" },
    ],
    learned:
      "The rollout now copies what worked in the best schools: classes set up in advance and a weekly call with the teacher.",
    role: "Led product and design",
    links: [
      { label: "for teachers", href: "https://www.zerogravity.co.uk/tutor/teachers" },
      { label: "for school leaders", href: "https://www.zerogravity.co.uk/tutor/school-leaders" },
    ],
    look: { bg: "#22543a", fg: "#f3df98", cover: "work/covers/school-hub.jpg", after: "Abbey Road, The Beatles", hours: 33 },
  },
  {
    kind: "Prototype",
    product: "Lease citations",
    title: "Made a legal AI prove every citation against the lease",
    at: "Independent",
    when: "Aug 2026",
    areas: ["prototype", "safety", "ai"],
    headline: { n: "1 click", label: "from claim to clause" },
    problem:
      "A document Q&A app for property lawyers showed \"3 sources cited\" under an answer about asbestos, in a lease that never mentions asbestos. The count came from a regex over the model's own reply.",
    explored: [
      "Every claim points to a quote, and code finds that quote word for word in the lease before it counts as evidence.",
      "Clicking a citation jumps to the highlighted clause. A quote that can't be found is shown dashed, next to the claim it weakens.",
      "Ruled out confidence scores and \"stated vs inferred\" labels, because both are the model marking its own work.",
    ],
    outcomes: [
      { n: "Code checks", label: "every quoted passage, found word for word in the lease" },
      { n: "Lawyer decides", label: "whether the wording supports the point" },
    ],
    role: "Designed and built it",
    links: [
      { label: "code and decisions", href: "https://github.com/ElliotJLT/lease-citations/blob/main/DECISIONS.md" },
      { label: "the audit", href: "https://github.com/ElliotJLT/lease-citations/blob/main/docs/audit.md" },
    ],
    look: { bg: "#e4e2dd", fg: "#1b3a6c", art: "work/video/lease.jpg", cover: "work/covers/lease-citations.jpg", after: "The Velvet Underground & Nico", hours: 30 },
    clip: {
      src: "work/video/lease.mp4",
      poster: "work/video/lease.jpg",
      chapters: [
        { label: "Ask", t: 0 },
        { label: "Answer", t: 5.5 },
        { label: "Open a source", t: 18.3 },
        { label: "Not located", t: 28.7 },
      ],
    },
  },
  {
    kind: "Prototype",
    product: "District nursing",
    title: "Designed a scheduler that leaves every clinical call to the nurse",
    at: "Independent",
    when: "Sep 2026",
    areas: ["prototype", "safety", "ai"],
    headline: { n: "40 min", label: "over, and the list no longer fits" },
    problem:
      "A home visit runs 40 minutes over and the rest of a district nurse's list no longer fits her shift. Someone has to decide who is seen today, who waits, and who follows up.",
    explored: [
      "It shows how far over the day is, and checks competency, care windows and shift time before suggesting a move.",
      "It never suggests a patient waits. It flags visits it can't fit and leaves that call to the nurse.",
      "Any visit that waits goes on tomorrow's list with an owner and a deadline.",
    ],
    outcomes: [
      { n: "Code checks", label: "competency, care windows and shift time" },
      { n: "Nurse decides", label: "every clinical change, recorded with a reason" },
    ],
    role: "Designed the service blueprint and built the walkthrough",
    links: [],
    look: { bg: "#e4e2dd", fg: "#22543a", art: "work/video/nursing.jpg", cover: "work/covers/district-nursing.jpg", after: "For Emma, Forever Ago, Bon Iver", hours: 57 },
    clip: {
      src: "work/video/nursing.mp4",
      poster: "work/video/nursing.jpg",
      chapters: [
        { label: "The signal", t: 0 },
        { label: "The decision", t: 14.1 },
        { label: "The follow-up", t: 26.8 },
      ],
    },
  },
  {
    kind: "Shipped",
    product: "Enterprise partnerships",
    title: "Doubled account size at renewal with HSBC, Morgan Stanley and KPMG",
    at: "Zero Gravity",
    when: "2022–24",
    areas: ["gtm", "ops"],
    headline: { n: "2×", label: "partner account size" },
    problem:
      "Banks and law firms wouldn't start a programme until we'd passed their due diligence, and we were a seed-stage startup.",
    explored: [
      "Built each programme into the partner's early-careers hiring, with HSBC, Morgan Stanley, KPMG, Ashurst, Accenture and Snap, and ran 100+ of them.",
      "Got ISO 27001 and 9001 in-house as data protection officer, so due diligence stopped holding deals up.",
    ],
    outcomes: [
      { n: "2×", label: "account size at renewal" },
      { n: "1%", label: "logo churn across strategic accounts" },
      { n: "30%", label: "shorter sales cycles" },
      { n: "< 6 months", label: "to ISO 27001 and 9001, done solo" },
    ],
    role: "Head of Operations & Enterprise Partnerships",
    links: [],
    look: { bg: "#1d2420", fg: "#d4b46c", cover: "work/covers/enterprise-partnerships.jpg", after: "Rumours, Fleetwood Mac", hours: 36 },
  },
  {
    kind: "Shipped",
    product: "Safeguarding",
    title: "Ran safeguarding for student–mentor messaging with zero missed cases",
    at: "Zero Gravity",
    when: "2022–24",
    areas: ["safety", "ops"],
    headline: { n: "0", label: "missed cases" },
    problem:
      "Students and adult mentors message each other on the platform. Any disclosure or grooming risk had to reach a person fast.",
    explored: [
      "Replaced keyword rules with AI flags, Unitary image recognition and hash matching.",
      "One named person accountable for every case, tracked on a case board with automated outreach to schools.",
      "Every flag triaged against KCSIE, the statutory guidance schools follow. I owned the policy and reported to the board monthly.",
    ],
    outcomes: [
      { n: "0", label: "missed cases, every flag triaged against KCSIE" },
      { n: "~20", label: "cases a month, 1 in 10 at the highest severity" },
      { n: "2.3h", label: "average response to schools" },
    ],
    role: "Designated safeguarding lead; built the system",
    links: [],
    look: { bg: "#ecebe7", fg: "#8e2f4f", cover: "work/covers/safeguarding.jpg", after: "Kid A, Radiohead", hours: 101 },
  },
  {
    kind: "Shipped",
    product: "Mentee to mentor",
    title: "Turned 40% of mentees into mentors, up from 6%",
    at: "Zero Gravity",
    when: "2022–24",
    areas: ["gtm"],
    headline: { n: "6% → 40%", label: "of mentees went on to mentor" },
    problem:
      "Students joined at school. The platform needed a reason for them to stay once they got to university.",
    explored: [
      "Worked on the sign-up funnel and first-week activation.",
      "Made becoming a mentor the step from school to university, so students who had been helped stayed to help the next group.",
      "Automated it with AI once the manual version worked.",
    ],
    outcomes: [{ n: "6% → 40%", label: "of mentees going on to mentor" }],
    role: "Led growth and operations",
    links: [],
    look: { bg: "#9c4011", fg: "#f3df98", cover: "work/covers/mentee-to-mentor.jpg", after: "Punisher, Phoebe Bridgers", hours: 30 },
  },
  {
    kind: "Shipped",
    product: "Company operating system",
    title: "Grew the company from 4 to 30 people without hiring for support",
    at: "Zero Gravity",
    when: "2022–24",
    areas: ["ops", "ai"],
    headline: { n: "91%", label: "of support resolved by AI" },
    problem:
      "As Zero Gravity grew from four people, hiring, budgets, revenue and support all ran by hand, and every new tool meant more copying between systems.",
    explored: [
      "One source of truth in Notion, with the other tools connected through HubSpot and Zapier.",
      "Every support answer written down once and every conversation tagged, so an AI assistant could handle the repeat questions.",
      "The tags went to the product team and later shaped the roadmap.",
    ],
    outcomes: [
      { n: "91%", label: "of support conversations resolved by the AI assistant" },
      { n: "4 → 30", label: "people, without a dedicated support hire" },
      { n: "2 weeks → 3 days", label: "to onboard a new hire" },
      { n: "£1.5m", label: "ARR, tracked and billed through the revenue ops" },
    ],
    role: "Built it as employee #4",
    links: [],
    look: { bg: "#f3df98", fg: "#1b3a6c", cover: "work/covers/company-operating-system.jpg", after: "Aerial, Kate Bush", hours: 12 },
  },
  {
    kind: "Shipped",
    product: "Probate operations",
    title: "Fixed probate intake so two solicitors did the work of five",
    at: "Farewill",
    when: "2021–22",
    areas: ["ops"],
    headline: { n: "5 → 2", label: "solicitors needed" },
    problem:
      "About 30% of solicitor time went on fixing input errors, and the plan was to hire more solicitors.",
    explored: [
      "Timed every step and gave each of a case's 23 stages its own deadline.",
      "A guided intake, plus integrations with the courts (HMCTS), HMRC and the banks.",
      "A framework for vulnerable customers that the whole company adopted.",
    ],
    outcomes: [
      { n: "5 → 2", label: "solicitors needed" },
      { n: "69%", label: "fewer errors by case agents" },
      { n: "2 weeks → 4 days", label: "to handle a case" },
      { n: "20 → 80+", label: "NPS" },
    ],
    learned:
      "A capacity model flagged the need for two more paralegals three weeks before anyone felt it, while the probate team grew from 2 to 12.",
    role: "Led product and operations",
    links: [{ label: "view the service", href: "https://farewill.com/apply-for-probate" }],
    look: { bg: "#e4e2dd", fg: "#8e2f4f", art: "work/farewill.jpg", cover: "work/covers/probate-operations.jpg", after: "All Things Must Pass, George Harrison", hours: 20 },
  },
  {
    kind: "Shipped",
    product: "MealsForTheNHS",
    title: "Co-founded a marketplace that fed NHS staff in 146 hospitals",
    at: "MealsForTheNHS",
    when: "2020",
    areas: ["ops", "gtm"],
    headline: { n: "303,000", label: "meals in 100 days" },
    problem:
      "Hospital staff needed feeding through the first COVID wave, and restaurants had closed.",
    explored: [
      "Ran it by hand on a WhatsApp group from day one and had a working marketplace by day ten.",
      "A four-sided marketplace on Airtable for hospitals, restaurants, drivers and donors, with automated dispatch that halved delivery errors.",
      "A hiring playbook that took the volunteer team from 6 to 120.",
    ],
    outcomes: [
      { n: "303,000", label: "meals in 100 days" },
      { n: "146", label: "hospitals, served by 223 restaurants" },
      { n: "£1.8m", label: "raised" },
      { n: "97%", label: "of deliveries on time" },
    ],
    role: "Co-founder",
    links: [],
    look: { bg: "#1b3a6c", fg: "#ecebe7", cover: "work/covers/mealsforthenhs.jpg", after: "Let It Bleed, The Rolling Stones", hours: 71 },
  },
  {
    kind: "Shipped",
    product: "Flash Pack operations",
    title: "Built Flash Pack's operations from scratch through 400% growth",
    at: "Flash Pack",
    when: "2018–20",
    areas: ["ops"],
    headline: { n: "90+", label: "NPS through the US launch" },
    problem:
      "When I joined, operations was the founders answering emails, with no CRM, ticketing or supplier contracts. Then the company grew 400% in a year.",
    explored: [
      "Marketing didn't launch in a new market until support was in place.",
      "Set up Intercom, response templates, supplier onboarding and a crisis protocol from scratch.",
      "Handled ATOL compliance, safety standards and insurance, with a 100% safety record through the Sri Lanka attacks and COVID closures.",
    ],
    outcomes: [
      { n: "90+", label: "NPS, held through the US launch" },
      { n: "12 weeks", label: "US launch plan, hit on the date" },
      { n: "15", label: "first ops hires, hired and trained" },
    ],
    role: "Operations manager, founding hire #10",
    links: [],
    look: { bg: "#e4e2dd", fg: "#22543a", art: "work/flash-pack.jpg", cover: "work/covers/flash-pack-operations.jpg", after: "Houses of the Holy, Led Zeppelin", hours: 42 },
  },
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const WORK: Story[] = STORIES.map((s) => ({ ...s, slug: slugify(s.product) }));
