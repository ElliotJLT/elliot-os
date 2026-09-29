"use client";

import { useState } from "react";


type Product = {
  order: string;
  name: string;
  /** What it is and who it's for, in one plain sentence. */
  summary: string;
  /** The problem, in one line. */
  problem: string;
  /** The decision taken, and what it risked, in one line. */
  bet: string;
  /** The proof: a number or short phrase and a plain label. */
  outcomes: { n: string; label: string }[];
  /** How: three short bullets at most. */
  how: string[];
  /** Elliot's part, one line. */
  role: string;
  lesson?: string;
  links: { label: string; href: string }[];
  /** A screenshot or photo shown when the card is open. */
  image?: { src: string; alt: string };
};

type Company = {
  name: string;
  /** Years, for the card eyebrow. */
  stint: string;
  logo: string;
  products: Product[];
};

const COMPANIES: Company[] = [
  {
    name: "Flash Pack",
    stint: "2018–20",
    logo: "career/flash-pack.jpeg",
    products: [
      {
        order: "10",
        name: "CX and crisis operations",
        summary:
          "The customer and crisis operations behind Flash Pack's small-group trips for solo travellers in their 30s and 40s, through 400% year-on-year growth.",
        problem:
          "When I joined, ops was the founders answering emails: no CRM, no ticketing, no supplier contracts.",
        bet:
          "Build the operation ahead of each market: marketing didn't go live until support coverage was confirmed.",
        outcomes: [
          { n: "90+", label: "NPS, held through the US launch" },
          { n: "12 weeks", label: "US launch plan, hit on the date" },
          { n: "3×", label: "international partner network" },
          { n: "15", label: "first ops hires, hired and trained" },
        ],
        how: [
          "Intercom, response templates, supplier onboarding and a crisis protocol, set up from scratch.",
          "ATOL compliance, safety standards and insurance, with a 100% safety record through the Sri Lanka attacks and COVID closures.",
        ],
        role: "Founding operator, hire #10",
        image: {
          src: "work/flash-pack.jpg",
          alt: "A Flash Pack trip page for Borneo: Into the Jungle, with photos of rainforest, orangutans and a reef",
        },
        links: [],
      },
    ],
  },
  {
    name: "MealsForTheNHS",
    stint: "2020",
    logo: "career/meals-for-the-nhs.jpeg",
    products: [
      {
        order: "09",
        name: "Hospital meals marketplace",
        summary:
          "A volunteer-run charity that got restaurant meals to NHS staff through the first COVID wave.",
        problem:
          "Hospitals needed to feed their staff through the first wave, and restaurants had closed.",
        bet:
          "Run it by hand on a WhatsApp group from day one, and have a working marketplace by day ten.",
        outcomes: [
          { n: "303,000", label: "meals in 100 days" },
          { n: "146", label: "hospitals, served by 223 restaurants" },
          { n: "£1.8m", label: "raised" },
          { n: "97%", label: "of deliveries on time" },
        ],
        how: [
          "A four-sided marketplace on Airtable: hospitals, restaurants, drivers and donors.",
          "Automated dispatch and routing, which halved delivery errors.",
          "A hiring playbook that took the volunteer team from 6 to 120.",
        ],
        role: "Co-founder",
        links: [],
      },
    ],
  },
  {
    name: "Farewill",
    stint: "2021–22",
    logo: "career/farewill.jpeg",
    products: [
      {
        order: "08",
        name: "Probate operations",
        summary:
          "Farewill's probate service, which helps grieving families through the legal work of settling an estate.",
        problem:
          "About 30% of solicitor time went on fixing input errors, and the plan on the table was to hire more solicitors.",
        bet:
          "Time every step, fix the input at the start and integrate with the courts, HMRC and the banks, instead of hiring.",
        outcomes: [
          { n: "69%", label: "fewer errors by case agents" },
          { n: "2 weeks → 4 days", label: "to handle a case" },
          { n: "5 → 2", label: "solicitors needed" },
          { n: "20 → 80+", label: "NPS" },
        ],
        how: [
          "A guided intake, and a tracker giving each of a case's 23 stages its own deadline.",
          "Integrations with the courts (HMCTS), HMRC and the banks.",
          "A framework for vulnerable customers, adopted company-wide.",
        ],
        role: "Led product and operations",
        image: {
          src: "work/farewill.jpg",
          alt: "Farewill's online will service, with its Trustpilot rating and the steps to continue online",
        },
        links: [
          { label: "view the service", href: "https://farewill.com/apply-for-probate" },
        ],
      },
    ],
  },
  {
    name: "Zero Gravity",
    stint: "2022–24",
    logo: "career/zero-gravity.jpeg",
    products: [
      {
        order: "07",
        name: "Company operating system",
        summary:
          "How Zero Gravity ran as it grew from 4 people: hiring, budgets, revenue ops, internal comms and a company brain in Notion.",
        problem:
          "Hiring, budgets, revenue tracking and company knowledge had no system behind them, and each new tool added more manual work.",
        bet:
          "Build one operating system and wire the tools together, so the team did less re-keying as it grew.",
        outcomes: [
          { n: "4 → 1", label: "SaaS platforms, replaced by one system with an MCP layer" },
          { n: "2 weeks → 3 days", label: "to onboard a new hire" },
          { n: "ISO 27001 + 9001", label: "done solo as DPO, which unlocked our first FTSE 100 contracts" },
        ],
        how: [
          "Hiring, onboarding, culture and a SaaS budget, run from one place.",
          "Revenue ops in HubSpot, with Zapier taking out the manual steps.",
          "A company brain in Notion that became the base of Zero Gravity OS.",
        ],
        role: "Built it as employee #4",
        links: [],
      },
      {
        order: "06",
        name: "School to university journey",
        summary:
          "The sign-up, activation and mentoring path that kept students on one platform from school through university.",
        problem:
          "Students joined at school, and the platform needed a reason for them to stay once they reached university.",
        bet:
          "Turn mentees into mentors, so students helped at school stayed on to help the next group.",
        outcomes: [
          { n: "120,000", label: "students through the journey" },
        ],
        how: [
          "Growth work across the sign-up funnel and first-week activation.",
          "Mentee-to-mentor conversion as the bridge from school to university.",
          "Automated with AI once the manual version worked.",
        ],
        role: "Led growth and operations",
        links: [],
      },
      {
        order: "05",
        name: "Customer support",
        summary:
          "The support function for students, mentors and partners: an AI assistant answering first, and a knowledge base the whole team used.",
        problem:
          "Support questions were answered by hand, and what students asked about wasn't recorded anywhere the product team could use.",
        bet:
          "Write each answer down once and tag every conversation, so an AI assistant could take the repeat questions and the product team could read the rest.",
        outcomes: [
          { n: "80%+", label: "CSAT" },
          { n: "Under 2h", label: "first response time" },
          { n: "48h", label: "time to resolution" },
        ],
        how: [
          "An AI assistant answering from the team's own knowledge base.",
          "Bot workflows and SLAs routing everything else to the right person.",
          "Conversation tags that later shaped the product roadmap.",
        ],
        role: "Built the function",
        links: [],
      },
    ],
  },
  {
    name: "Zero Gravity",
    stint: "2024–26",
    logo: "career/zero-gravity.jpeg",
    products: [
      {
        order: "04",
        name: "Learning pathways",
        summary:
          "Short, Duolingo-style courses funded by partners, with an AI assignment at the end.",
        problem:
          "Students had nothing useful to do on the platform between mentoring sessions.",
        bet:
          "Bite-size, partner-funded courses would bring them back between sessions.",
        outcomes: [
          { n: "46%", label: "of students who started a pathway finished it" },
          { n: "12%", label: "uptake, against a 45% target" },
        ],
        how: [
          "Built with partners including Accenture, HSBC, KPMG and Snap.",
          "Video, bite-size progression, quizzes and an AI assignment to finish.",
        ],
        role: "Led product and design",
        lesson:
          "Completion held up; uptake never did. Students didn't come back to browse, and that miss shaped Career Co-pilot: bring the next useful thing to the student.",
        links: [
          { label: "see learning at Zero Gravity", href: "https://www.zerogravity.co.uk/" },
        ],
      },
      {
        order: "03",
        name: "Career Co-pilot",
        summary:
          "An AI career assistant that searched a student's CV, job posts and community posts, and talked them through what fitted.",
        problem:
          "The platform held students' CVs, thousands of job posts and thousands of community posts, and no way to ask across them.",
        bet:
          "Ship retrieval and tool calling early, as a beta, so the next AI product would start with that work done.",
        outcomes: [
          { n: "First", label: "AI product on the platform, run as a beta" },
          { n: "Groundwork", label: "the retrieval and tool calling the tutor was built on" },
        ],
        how: [
          "Tool calls across the student's CV, job posts and community posts.",
          "Retrieves what's relevant and talks it through in chat.",
          "Never invents experience the student doesn't have.",
        ],
        role: "Led product, design and delivery",
        links: [
          { label: "hear the podcast", href: "https://open.spotify.com/episode/3D8quBCXrMNgIF87czhux3" },
        ],
      },
      {
        order: "02",
        name: "School hub",
        summary:
          "The teacher's side of the tutor: one homework for the class, help at each student's level, and the teacher sees who's stuck the same day.",
        problem:
          "Teachers set one homework for a whole class and only find out who was stuck when they mark it.",
        bet:
          "Roll out through teachers, class by class, rather than asking students to sign up on their own.",
        outcomes: [
          { n: "850+", label: "UK schools" },
          { n: "91%", label: "of students activate when a teacher rolls it out, against 23% on self-signup" },
        ],
        how: [
          "Homework built from the teacher's own material.",
          "A weekly summary per class: who to nudge, who to stretch.",
          "Data-protection paperwork ready before a school asks for it.",
        ],
        role: "Led product and design",
        links: [
          { label: "for teachers", href: "https://www.zerogravity.co.uk/tutor/teachers" },
          { label: "for school leaders", href: "https://www.zerogravity.co.uk/tutor/school-leaders" },
        ],
      },
      {
        order: "01",
        name: "AI STEM tutor",
        summary:
          "An AI tutor for GCSE and A-level students that coaches them to the answer instead of handing it over.",
        problem:
          "Students without a tutor at home get stuck alone, and a general chatbot just gives them the answer.",
        bet:
          "A tutor that never hands over the answer would still keep students coming back.",
        outcomes: [
          { n: "10,000", label: "students by June 2026" },
          { n: "47%", label: "of monthly students active each week" },
          { n: "67% → 99%+", label: "marking accuracy against official mark schemes" },
          { n: "Under a month", label: "from first commit to the App Store" },
        ],
        how: [
          "Coaching, practice, marking and assignments run as separate agents, each graded by its own evaluator.",
          "Built to the Department for Education's safety standards for under-18s: false safeguarding alarms down 97%, none missed.",
          "Selected for the UK government's AI Tutoring Tools Pioneers Programme.",
        ],
        role: "Led product and a squad of six engineers, and wrote 28% of the build's commits",
        image: {
          src: "work/tutor.jpg",
          alt: "Two screens of the Zero Gravity tutor app: the home screen asking what you want to learn today, and the subject picker",
        },
        links: [
          { label: "view the product", href: "https://www.zerogravity.co.uk/tutor" },
          { label: "App Store", href: "https://apps.apple.com/gb/app/zero-gravity-tutor/id6760364095" },
          { label: "trust and safeguarding", href: "https://www.zerogravity.co.uk/tutor/trust" },
        ],
      },
    ],
  },
];

// Newest first: the tutor and its school hub, the operations years at Zero
// Gravity, then back through the career.
const ORDER = [
  "AI STEM tutor",
  "School hub",
  "Career Co-pilot",
  "Learning pathways",
  "Customer support",
  "School to university journey",
  "Company operating system",
  "Probate operations",
  "Hospital meals marketplace",
  "CX and crisis operations",
];

/**
 * The work as a stack of slim cards: company, product, the bet in a line and
 * the headline proof. One opens at a time, showing the problem, the bet in
 * full, the proof and a screenshot. Everything is in the page; closed cards
 * only collapse it.
 */
export default function ProductPortfolio({ basePath = "" }: { basePath?: string }) {
  const cases = COMPANIES.flatMap((company) =>
    company.products.map((product) => ({ company, product })),
  ).sort((a, b) => ORDER.indexOf(a.product.name) - ORDER.indexOf(b.product.name));
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="ws">
      {cases.map(({ company, product }) => (
        <WorkCard
          key={product.name}
          company={company}
          product={product}
          basePath={basePath}
          open={open === product.name}
          onToggle={() =>
            setOpen((o) => (o === product.name ? null : product.name))
          }
        />
      ))}
    </div>
  );
}

function WorkCard({
  company,
  product,
  basePath,
  open,
  onToggle,
}: {
  company: Company;
  product: Product;
  basePath: string;
  open: boolean;
  onToggle: () => void;
}) {
  const id = `work-${product.order}`;
  // Elliot's part and the links sit under the screenshot when there is one,
  // so the left column ends on the evidence rather than a credit line.
  const foot = (
    <div className="ws-foot">
      <span className="ws-label">My part</span>
      <p className="ws-role-text">{product.role}</p>
      {product.links.length > 0 && (
        <p className="ws-links">
          {product.links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label} ↗
            </a>
          ))}
        </p>
      )}
    </div>
  );
  return (
    <article className="ws-card" data-open={open || undefined}>
      <h3 className="ws-h">
        <button
          type="button"
          className="ws-row"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
        >
          {/* The eyebrow names the company. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ws-logo"
            src={`${basePath}/${company.logo}`}
            alt=""
            width={40}
            height={40}
          />
          <span className="ws-id">
            <span className="ws-co">
              {company.name} · {company.stint}
            </span>
            <span className="ws-name">{product.name}</span>
          </span>
          <span className="ws-bet">{product.summary}</span>
          <span className="ws-plus" aria-hidden="true" />
        </button>
      </h3>

      <div className="ws-panel" id={id} role="region" aria-label={product.name}>
        <div className="ws-panel-in">
          <div className="ws-body">
            <span className="ws-label">Problem</span>
            <p className="ws-problem">{product.problem}</p>
            <span className="ws-label">The bet</span>
            <p>{product.bet}</p>
            <span className="ws-label">Proof</span>
            {product.outcomes.length > 0 && (
              <dl className="ws-outcomes">
                {product.outcomes.map((o) => (
                  <div key={o.n}>
                    <dt>{o.n}</dt>
                    <dd>{o.label}</dd>
                  </div>
                ))}
              </dl>
            )}
            <span className="ws-label">How</span>
            <ul className="ws-points">
              {product.how.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
            {product.lesson && (
              <p className="product-lesson">
                <span>What we learned</span>
                {product.lesson}
              </p>
            )}
            {!product.image && foot}
          </div>
          {product.image && (
            <div className="ws-side">
              <figure className="ws-shot">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}/${product.image.src}`}
                  alt={product.image.alt}
                  loading="lazy"
                />
              </figure>
              {foot}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
