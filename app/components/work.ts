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
};

const STORIES: Omit<Story, "slug">[] = [
  {
    kind: "Shipped",
    product: "AI STEM tutor",
    title: "Built an AI tutor that coaches instead of answering",
    at: "Zero Gravity",
    when: "2026",
    areas: ["ai"],
    headline: { n: "30 → 850+", label: "schools" },
    problem:
      "Students without a tutor at home get stuck alone, and a general chatbot just gives them the answer.",
    explored: [
      "Coaching, practice, marking and assignments as separate agents, each graded by its own evaluator, across Maths, Physics, Chemistry and Biology for AQA, Edexcel, OCR and IB.",
      "Red-teamed the failure that matters most: a student talking the tutor into handing over the answer. Then a pass/fail judge on every session.",
      "A four-agent fleet read every production trace overnight, replaced a planned ops hire and produced half the evidence in the company retro.",
    ],
    outcomes: [
      { n: "30 → 850+", label: "schools, from the beta to the national programme" },
      { n: "67% → 99%+", label: "marking on the golden set: bare model, then the syllabus we covered" },
      { n: "33% → 65%", label: "Socratic pass rate, doubled in two weeks, graded on every session" },
      { n: "50,000+", label: "tutoring sessions" },
    ],
    learned:
      "When production ran 4.6x over the cost plan, we cut it without touching quality: prompt caching, a model per task, and Opus kept on marking. Next, the Pioneers pilot measures what it does for pupils' grades.",
    role: "Led product, a designer and six product engineers, each owning a problem from prototype to production, and wrote 28% of the commits",
    links: [
      { label: "view the product", href: "https://www.zerogravity.co.uk/tutor" },
      { label: "App Store", href: "https://apps.apple.com/gb/app/zero-gravity-tutor/id6760364095" },
    ],
    look: { bg: "#f3df98", fg: "#22543a", art: "work/tutor.jpg", cover: "work/covers/ai-stem-tutor.jpg", after: "OK Computer, Radiohead", hours: 101 },
  },
  {
    kind: "Shipped",
    product: "Tutor safety",
    title: "Got schools to trust an AI tutor with their students",
    at: "Zero Gravity",
    when: "2026",
    areas: ["safety", "ai"],
    headline: { n: "2nd of 8", label: "in the DfE programme" },
    problem:
      "Harris Federation's AI lead told us admin visibility and safeguarding were gate conditions, not features. Until both were met, the question was whether a school would let the tutor near students at all.",
    explored: [
      "Safeguarding detection shipped as the first feature, tuned to over-flag, with the designated safeguarding lead holding every judgement.",
      "Tuned it loud on purpose, then split conduct from safeguarding so the lead only gets paged for what matters.",
      "Built to the DfE's generative AI product safety standards for under-18s: session cut-offs, never presenting as human, and concerns escalated to a named person.",
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
    title: "Rolled the tutor out through teachers, class by class",
    at: "Zero Gravity",
    when: "2026",
    areas: ["gtm", "ai"],
    headline: { n: "91%", label: "activation, teacher-led" },
    problem:
      "Teachers set one homework for a whole class and only find out who was stuck when they mark it. Help a student has to go and find mostly goes unused.",
    explored: [
      "Harris told us that to enter the curriculum we had to build for teachers, so the teacher became the way in.",
      "Homework built from the teacher's own material, after a head of maths said typing mark schemes was too slow.",
      "A weekly summary per class, safeguarding flags to named staff only, and the DPIA written before a data lead asks for it.",
    ],
    outcomes: [
      { n: "91% vs 23%", label: "activation when teachers lead it, against students signing up alone" },
      { n: "850+", label: "UK schools" },
    ],
    learned:
      "The rollout copies the schools that worked: classes built in advance and a weekly call with the teacher.",
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
    title: "Made every citation in a legal answer checkable",
    at: "Independent",
    when: "Aug 2026",
    areas: ["prototype", "safety", "ai"],
    headline: { n: "1 click", label: "from claim to clause" },
    problem:
      "A document Q&A app for property lawyers showed \"3 sources cited\" under an answer about asbestos, in a lease that never mentions asbestos. The count was a regex over the model's own reply.",
    explored: [
      "Every claim carries a marker naming its quote, and code finds that quote word for word in the lease before it counts as evidence.",
      "A match jumps to the highlighted clause. A quote it can't find is drawn dashed, against the claim it weakens.",
      "Ruled out confidence scores and \"stated vs inferred\" labels: both are the model grading itself.",
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
    product: "Persona interviews",
    title: "Showed which synthetic answers rest on real data",
    at: "Independent",
    when: "Jul 2026",
    areas: ["prototype", "safety", "ai"],
    headline: { n: "Solid", label: "or dashed" },
    problem:
      "Teams survey AI personas, then interview one to find out why it answered as it did. A plain chat renders fluent invention and grounded fact the same way.",
    explored: [
      "Each claim is solid if it traces to the respondent's survey answer or profile, and dashed if the model is reasoning past them.",
      "Asked to speak for people who weren't surveyed, the persona says it would be guessing.",
      "Ruled out a blanket \"all views are fictional\" notice. It concedes the problem and manages none of it.",
    ],
    outcomes: [
      { n: "Code checks", label: "every claim against the respondent's own answer or profile" },
      { n: "Researcher decides", label: "what to quote, seeing how much rested on data" },
    ],
    role: "Designed and built it",
    links: [
      { label: "code and reasoning", href: "https://github.com/ElliotJLT/persona-interviews" },
    ],
    look: { bg: "#f3df98", fg: "#8e2f4f", art: "work/video/persona.jpg", cover: "work/covers/persona-interviews.jpg", after: "Blonde, Frank Ocean", hours: 56 },
    clip: {
      src: "work/video/persona.mp4",
      poster: "work/video/persona.jpg",
      chapters: [
        { label: "Population", t: 0 },
        { label: "Record", t: 8.6 },
        { label: "Interview", t: 12 },
        { label: "Refusal", t: 21 },
      ],
    },
  },
  {
    kind: "Prototype",
    product: "District nursing",
    title: "Kept a named nurse in charge when the day overruns",
    at: "Independent",
    when: "Sep 2026",
    areas: ["prototype", "safety", "ai"],
    headline: { n: "40 min", label: "over, and the list no longer fits" },
    problem:
      "A home visit runs 40 minutes over, and the rest of a district nurse's list no longer fits her shift. Someone has to decide who is seen, who waits, and who owns the ones who wait.",
    explored: [
      "The assistant shows the shortfall and checks competency, care windows and shift time before a move reaches a nurse's screen.",
      "Ruled out letting the assistant propose that a patient waits. It flags what it can't place instead.",
      "Any visit that waits lands on tomorrow's list with an owner and a deadline.",
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
    title: "Got a seed-stage startup through bank due diligence",
    at: "Zero Gravity",
    when: "2022–24",
    areas: ["gtm", "ops"],
    headline: { n: "2×", label: "partner account size" },
    problem:
      "Selling into banks and law firms meant passing their due diligence before any programme could start.",
    explored: [
      "Built each programme into the partner's early-careers hiring, with HSBC, Morgan Stanley, KPMG, Ashurst, Accenture and Snap, and ran 100+ of them.",
      "Did ISO 27001 and 9001 in-house, as data protection officer, so due diligence stopped being the blocker.",
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
    title: "Kept messages between students and adult mentors safe",
    at: "Zero Gravity",
    when: "2022–24",
    areas: ["safety", "ops"],
    headline: { n: "0", label: "missed cases" },
    problem:
      "Students and adult mentors message each other, so a disclosure or a grooming risk in any message had to reach a person fast.",
    explored: [
      "Moved from keyword rules to AI flags, Unitary image recognition and hash matching.",
      "One named person accountable for every case, on a case board with automated outreach to schools.",
      "Triaged every flag against KCSIE, the statutory guidance schools work to, owned the policy and reported to the board every month.",
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
    title: "Turned students we mentored into mentors",
    at: "Zero Gravity",
    when: "2022–24",
    areas: ["gtm"],
    headline: { n: "6% → 40%", label: "of mentees went on to mentor" },
    problem:
      "Students joined at school, and the platform needed a reason for them to stay once they reached university.",
    explored: [
      "Growth work across the sign-up funnel and first-week activation.",
      "Mentee-to-mentor conversion as the bridge from school to university, so students helped at school stayed to help the next group.",
      "Automated with AI once the manual version worked.",
    ],
    outcomes: [{ n: "6% → 40%", label: "of mentees going on to mentor" }],
    role: "Led growth and operations",
    links: [],
    look: { bg: "#9c4011", fg: "#f3df98", cover: "work/covers/mentee-to-mentor.jpg", after: "Punisher, Phoebe Bridgers", hours: 30 },
  },
  {
    kind: "Shipped",
    product: "Company operating system",
    title: "Built the operation so headcount didn't grow with it",
    at: "Zero Gravity",
    when: "2022–24",
    areas: ["ops", "ai"],
    headline: { n: "91%", label: "of support resolved by AI" },
    problem:
      "As Zero Gravity grew from four people, hiring, budgets, revenue and support ran by hand, and each new tool added more re-keying.",
    explored: [
      "One company brain in Notion, with the tools wired together through HubSpot and Zapier.",
      "Every support answer written down once and every conversation tagged, so an AI assistant could take the repeat questions.",
      "The tags went to the product team, and later shaped the roadmap.",
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
    title: "Fixed probate's inputs instead of hiring more solicitors",
    at: "Farewill",
    when: "2021–22",
    areas: ["ops"],
    headline: { n: "5 → 2", label: "solicitors needed" },
    problem:
      "About 30% of solicitor time went on fixing input errors, and the plan on the table was to hire more solicitors.",
    explored: [
      "Timed every step, and gave each of a case's 23 stages its own deadline.",
      "A guided intake, and integrations with the courts (HMCTS), HMRC and the banks.",
      "A framework for vulnerable customers, adopted company-wide.",
    ],
    outcomes: [
      { n: "5 → 2", label: "solicitors needed" },
      { n: "69%", label: "fewer errors by case agents" },
      { n: "2 weeks → 4 days", label: "to handle a case" },
      { n: "20 → 80+", label: "NPS" },
    ],
    learned:
      "A capacity model called the need for two more paralegals three weeks before anyone felt it, while the probate team grew from 2 to 12.",
    role: "Led product and operations",
    links: [{ label: "view the service", href: "https://farewill.com/apply-for-probate" }],
    look: { bg: "#e4e2dd", fg: "#8e2f4f", art: "work/farewill.jpg", cover: "work/covers/probate-operations.jpg", after: "All Things Must Pass, George Harrison", hours: 20 },
  },
  {
    kind: "Shipped",
    product: "MealsForTheNHS",
    title: "Got restaurant meals to NHS staff through the first wave",
    at: "MealsForTheNHS",
    when: "2020",
    areas: ["ops", "gtm"],
    headline: { n: "303,000", label: "meals in 100 days" },
    problem:
      "Hospitals needed to feed their staff through the first COVID wave, and restaurants had closed.",
    explored: [
      "Ran it by hand on a WhatsApp group from day one, and had a working marketplace by day ten.",
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
    title: "Built Flash Pack's operation ahead of each new market",
    at: "Flash Pack",
    when: "2018–20",
    areas: ["ops"],
    headline: { n: "90+", label: "NPS through the US launch" },
    problem:
      "When I joined, operations was the founders answering emails: no CRM, no ticketing, no supplier contracts. Then the company grew 400% in a year.",
    explored: [
      "Marketing didn't go live in a market until support coverage was confirmed.",
      "Intercom, response templates, supplier onboarding and a crisis protocol, set up from scratch.",
      "ATOL compliance, safety standards and insurance, with a 100% safety record through the Sri Lanka attacks and COVID closures.",
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
