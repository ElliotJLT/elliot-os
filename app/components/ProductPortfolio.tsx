"use client";

import { useState } from "react";


type Product = {
  order: string;
  name: string;
  /** What it is and who it's for, in one plain sentence. */
  summary: string;
  /** The one number the closed row leads with. */
  headline: { n: string; label: string };
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
        headline: { n: "90+", label: "NPS, held through the US launch" },
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
        role: "Operations manager, founding hire #10",
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
        headline: { n: "303,000", label: "meals in 100 days" },
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
          "A four-sided marketplace on Airtable for hospitals, restaurants, drivers and donors, with automated dispatch that halved delivery errors.",
          "NHS data-sharing agreements across the 146 hospitals, set up under crisis conditions.",
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
        headline: { n: "5 → 2", label: "solicitors needed, once the input errors were fixed" },
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
        order: "12",
        name: "Enterprise partnerships",
        summary:
          "Paid programmes run inside the early-careers hiring of HSBC, Morgan Stanley, KPMG, Ashurst, Accenture and Snap.",
        headline: { n: "2×", label: "the size of our partner accounts" },
        problem:
          "A seed-stage startup selling into banks and law firms had to get through their due diligence before any programme could start.",
        bet:
          "Build each programme into the partner's early-careers hiring, and get ISO 27001 and 9001 done in-house so due diligence stopped being the blocker.",
        outcomes: [
          { n: "2×", label: "the size of those accounts" },
          { n: "30%", label: "shorter sales cycles" },
          { n: "< 6 months", label: "to ISO 27001 and 9001, done solo as DPO" },
        ],
        how: [
          "Scoped, sold and delivered the programmes, and owned milestones and renewals.",
          "Took us through due diligence with HSBC, Morgan Stanley, KPMG and Mercedes-AMG F1.",
        ],
        role: "Head of Operations & Enterprise Partnerships",
        links: [],
      },
      {
        order: "11",
        name: "Safeguarding",
        summary:
          "The flagging and case system that kept messages between students and adult mentors safe, run with me as designated safeguarding lead.",
        headline: { n: "0", label: "missed safeguarding cases, triaged against KCSIE" },
        problem:
          "Students and adult mentors message each other, so a disclosure or a grooming risk in any message had to reach a person fast.",
        bet:
          "Move from keyword rules to AI flags, image recognition and hash matching, with one named person accountable for every case.",
        outcomes: [
          { n: "0", label: "missed cases, every flag triaged against KCSIE" },
          { n: "~20", label: "cases a month, 1 in 10 at the highest severity" },
          { n: "2.3h", label: "average response to schools" },
        ],
        how: [
          "Regex flags first, then AI flags with Unitary image recognition, then hash matching.",
          "A kanban of cases, with automated outreach to schools.",
          "Triaged every flag against KCSIE, the statutory guidance schools work to, owned the policy and reported to the board every month.",
        ],
        role: "Designated safeguarding lead; built the system",
        links: [],
      },
      {
        order: "07",
        name: "Company operating system",
        summary:
          "How Zero Gravity ran as it grew from 4 people: hiring, budgets, revenue ops, internal comms and a company brain in Notion.",
        headline: { n: "£1.5m", label: "ARR, run through the revenue ops" },
        problem:
          "Hiring, budgets, revenue tracking and company knowledge had no system behind them, and each new tool added more manual work.",
        bet:
          "Build one operating system and wire the tools together, so the team did less re-keying as it grew.",
        outcomes: [
          { n: "£1.5m", label: "ARR, tracked and billed through the revenue ops" },
          { n: "4 → 1", label: "SaaS platforms, replaced by one system with an MCP layer" },
          { n: "2 weeks → 3 days", label: "to onboard a new hire" },
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
        headline: { n: "6% → 40%", label: "of mentees going on to mentor" },
        problem:
          "Students joined at school, and the platform needed a reason for them to stay once they reached university.",
        bet:
          "Turn mentees into mentors, so students helped at school stayed on to help the next group.",
        outcomes: [
          { n: "6% → 40%", label: "of mentees going on to mentor" },
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
        headline: { n: "91%", label: "of conversations resolved by the AI assistant" },
        problem:
          "Support questions were answered by hand, and what students asked about wasn't recorded anywhere the product team could use.",
        bet:
          "Write each answer down once and tag every conversation, so an AI assistant could take the repeat questions and the product team could read the rest.",
        outcomes: [
          { n: "91%", label: "of conversations resolved by the AI assistant" },
          { n: "8h → 4h", label: "of support time a week, so no dedicated hire" },
          { n: "84%", label: "CSAT: rated 4 or 5 out of 5" },
          { n: "80+", label: "NPS" },
        ],
        how: [
          "An AI assistant answering from the team's own knowledge base.",
          "Bot workflows routing the rest, on SLAs of first response under 2 hours and resolution within 48.",
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
        headline: { n: "46%", label: "of students who started a pathway finished it" },
        problem:
          "Students had nothing useful to do on the platform between mentoring sessions.",
        bet:
          "Bite-size, partner-funded courses would bring them back between sessions.",
        outcomes: [
          { n: "46%", label: "of students who started a pathway finished it" },
        ],
        how: [
          "Built with partners including Accenture, HSBC, KPMG and Snap.",
          "Video, bite-size progression, quizzes and an AI assignment to finish.",
        ],
        role: "Led product and design",
        lesson:
          "Students who started a pathway finished it, but they didn't come back to browse for the next one. That shaped Career Co-pilot: bring the next useful thing to the student.",
        links: [
          { label: "see learning at Zero Gravity", href: "https://www.zerogravity.co.uk/" },
        ],
      },
      {
        order: "03",
        name: "Career Co-pilot",
        summary:
          "An AI career assistant that searched a student's CV, job posts and community posts, and talked them through what fitted.",
        headline: { n: "Beta", label: "the retrieval the tutor was built on" },
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
        headline: { n: "98.7%", label: "activation in teacher-led schools, over 6× self-signup" },
        problem:
          "Teachers set one homework for a whole class and only find out who was stuck when they mark it.",
        bet:
          "Roll out through teachers, class by class, rather than asking students to sign up on their own.",
        outcomes: [
          { n: "850+", label: "UK schools" },
          { n: "98.7%", label: "activation in teacher-led schools, more than six times the self-signup rate" },
        ],
        how: [
          "Homework built from the teacher's own material.",
          "A weekly summary per class: who to nudge, who to stretch.",
          "A rollout pattern taken from the schools that worked: classes built in advance and a weekly call with the teacher.",
          "Data-protection paperwork ready before a school asks for it.",
        ],
        lesson:
          "Help a student has to go and find mostly goes unused. So the tutor turns up inside homework their teacher has already set.",
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
        headline: { n: "30 → 850+", label: "schools, from the beta to the national programme" },
        problem:
          "Students without a tutor at home get stuck alone, and a general chatbot just gives them the answer.",
        bet:
          "A tutor that never hands over the answer would still earn a place in a student's week, with session limits so it never becomes a crutch.",
        outcomes: [
          { n: "30 → 850+", label: "schools: a 30-school beta, then the full launch" },
          { n: "2nd of 8", label: "in the DfE's AI Tutoring Tools Pioneers Programme, picked from 53 bids" },
          { n: "67% → 99%+", label: "marking on the golden set: bare model 67%, retrieval 79%, the syllabus we covered 99%+" },
          { n: "33% → 65%", label: "Socratic pass rate, doubled in two weeks, graded on every session" },
          { n: "10,000", label: "students by June 2026" },
          { n: "47%", label: "of monthly students active each week" },
        ],
        how: [
          "Coaching, practice, marking and assignments run as separate agents, each graded by its own evaluator.",
          "Red-teamed the failure that matters most: a student talking the tutor into handing over the answer.",
          "Open-coded production traces into failure modes (sycophancy on \"I don't know\", inconsistency across modes, hallucinated marks), then a pass/fail LLM judge on every session.",
          "Built to the DfE's generative AI product safety standards for under-18s: session cut-offs, never presenting as human, and concerns escalated to a named person. False safeguarding alarms fell 97%, with no disclosure missed.",
          "What it doesn't prove yet is learning. We measured use and marking accuracy, not grades. The Pioneers pilot ends with an impact report on pupils, and that's the real test.",
        ],
        lesson:
          "Production came in at 4.6x the planned cost, and one model was taking 44.5% of spend. We routed by task, kept Opus on marking, and pulled a model 14x cheaper after 7 of 8 complaints traced to it.",
        role: "Led product, a designer and six product engineers, each owning a problem from prototype to production, and wrote 28% of the commits",
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

// Newest first, in three eras: the product years at Zero Gravity, the
// operations years before them, then the career before Zero Gravity.
const GROUPS = [
  {
    title: "Led product",
    when: "Zero Gravity · 2024–26",
    names: ["AI STEM tutor", "School hub", "Career Co-pilot", "Learning pathways"],
  },
  {
    title: "Built the operation",
    when: "Zero Gravity · 2022–24",
    names: ["Enterprise partnerships", "Safeguarding", "Customer support", "School to university journey", "Company operating system"],
  },
  {
    title: "Before Zero Gravity",
    when: "2018–22",
    names: ["Probate operations", "Hospital meals marketplace", "CX and crisis operations"],
  },
];

/**
 * The work as slim cards in three eras: company, product and the one number
 * that proves it. One opens at a time, showing the problem, the bet in
 * full, the proof and a screenshot. Everything is in the page; closed cards
 * only collapse it.
 */
export default function ProductPortfolio({ basePath = "" }: { basePath?: string }) {
  const byName = new Map(
    COMPANIES.flatMap((company) =>
      company.products.map((product) => [product.name, { company, product }] as const),
    ),
  );
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="ws">
      {GROUPS.map((group) => (
        <section className="ws-group" key={group.title} aria-label={group.title}>
          <h3 className="ws-group-h">
            <span>{group.title}</span> {group.when}
          </h3>
          {group.names.map((name) => {
            const { company, product } = byName.get(name)!;
            return (
              <WorkCard
                key={name}
                company={company}
                product={product}
                basePath={basePath}
                // The era heading already carries Zero Gravity's years.
                showStint={!group.when.includes(company.stint)}
                open={open === name}
                onToggle={() => setOpen((o) => (o === name ? null : name))}
              />
            );
          })}
        </section>
      ))}
    </div>
  );
}

function WorkCard({
  company,
  product,
  basePath,
  showStint,
  open,
  onToggle,
}: {
  company: Company;
  product: Product;
  basePath: string;
  showStint: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const id = `work-${product.order}`;
  // Elliot's part and the links sit under the screenshot when there is one,
  // so the left column ends on the evidence rather than a credit line.
  const foot = (
    <div className="ws-foot ws-zone ws-block">
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
      <h4 className="ws-h">
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
              {showStint ? `${company.name} · ${company.stint}` : company.name}
            </span>
            <span className="ws-name">{product.name}</span>
          </span>
          <span className="ws-lead">
            <b>{product.headline.n}</b>
            <span>{product.headline.label}</span>
          </span>
          <span className="ws-plus" aria-hidden="true" />
        </button>
      </h4>

      <div className="ws-panel" id={id} role="region" aria-label={product.name}>
        <div className="ws-panel-in">
          {/* Three zones split by dashed rules: the case (what it is, the
              problem, the bet), the proof, and how it was done. One sans
              for everything you read, display only for names and numbers,
              mono only for labels and links. */}
          <div className="ws-body">
            <div className="ws-zone">
              <p className="ws-summary">{product.summary}</p>
              <div className="ws-block">
                <span className="ws-label">Problem</span>
                <p>{product.problem}</p>
              </div>
              <div className="ws-block">
                <span className="ws-label">The bet</span>
                <p>{product.bet}</p>
              </div>
            </div>
            {product.outcomes.length > 0 && (
              <div className="ws-zone ws-block">
                <span className="ws-label">Proof</span>
                <dl className="ws-outcomes">
                  {product.outcomes.map((o) => (
                    <div key={o.n}>
                      <dt>{o.n}</dt>
                      <dd>{o.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            <div className="ws-zone">
              <div className="ws-block">
                <span className="ws-label">How</span>
                <ul className="ws-points">
                  {product.how.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
              {product.lesson && (
                <div className="ws-block">
                  <span className="ws-label">What we learned</span>
                  <p>{product.lesson}</p>
                </div>
              )}
            </div>
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
