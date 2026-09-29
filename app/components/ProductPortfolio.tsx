"use client";

import { useState } from "react";


type Product = {
  order: string;
  name: string;
  ownership: string;
  problem: {
    title: string;
  };
  bet: {
    title: string;
    /** What was done, as short bullets. */
    points: string[];
    proof?: string;
    lesson?: string;
  };
  links: { label: string; href: string }[];
  /** A screenshot or photo shown when the card is open. */
  image?: { src: string; alt: string };
};

type Company = {
  name: string;
  meta: string;
  /** Years, for the card eyebrow. The role is in meta and on the CV. */
  stint: string;
  logo: string;
  products: Product[];
};

const COMPANIES: Company[] = [
  {
    name: "Farewill",
    meta: "Product & Operations Lead · 2021–22",
    stint: "2021–22",
    logo: "career/farewill.jpeg",
    products: [
      {
        order: "01",
        name: "Probate operations",
        image: {
          src: "work/farewill.jpg",
          alt: "Farewill's online will service, with its Trustpilot rating and the steps to continue online",
        },
        ownership: "Led product, operations and workflow design",
        problem: {
          title:
            "Families could not see the next step, and legal specialists spent expert time on administration.",
        },
        bet: {
          title:
            "We gave each case a structured path and the legal team an operating system.",
          points: [
            "Worked between customers, legal specialists and operations.",
            "Guided intake that fills in the case data, with automation and audit logs around the legal workflow.",
            "A tracker showing each case's next action and the specialist time it needs.",
            "Integrations with HMCTS, HMRC and the banks, so the legal team only handled decisions.",
            "A vulnerable-user framework, adopted company-wide.",
          ],
          proof:
            "Agent errors down 69% · case handling from two weeks to four days",
        },
        links: [
          {
            label: "view the service",
            href: "https://farewill.com/apply-for-probate",
          },
        ],
      },
    ],
  },
  {
    name: "Zero Gravity",
    meta: "Founding hire #4 · Head of Product · 2022–26",
    stint: "2022–26",
    logo: "career/zero-gravity.jpeg",
    products: [
      {
        order: "02",
        name: "Learning pathways",
        ownership: "Led product and design with the engineering team",
        problem: {
          title: "Students had no useful next step between mentoring sessions.",
        },
        bet: {
          title: "Partner-funded learning paths filled the gap.",
          points: [
            "Staged courses with partners including Accenture, HSBC, KPMG and Snap, shipped in 2023.",
            "Video, Duolingo-style progression, quizzes and an early AI skills check.",
            "A self-serve layer between mentoring sessions, and a concrete way for partners to fund preparation.",
          ],
          lesson:
            "Students did not return to the library enough. That miss shaped Career Co-pilot: bring the next useful thing to the student instead of waiting for them to browse.",
        },
        links: [
          {
            label: "see learning at Zero Gravity",
            href: "https://www.zerogravity.co.uk/",
          },
        ],
      },
      {
        order: "03",
        name: "Career Co-pilot",
        ownership: "Led product, design and team delivery",
        problem: {
          title:
            "Students had to know what help they needed and where to find it.",
        },
        bet: {
          title: "Career Co-pilot turned the catalogue into a guided next step.",
          points: [
            "The first end-to-end AI product on the Zero Gravity platform.",
            "Builds the CV with the student from their existing CV and profile, with guardrails against invented experience.",
            "Suggests the right mentors and learning, and pulls in useful community posts.",
            "Answers career questions against the platform's own knowledge.",
          ],
          proof: "First end-to-end AI product on the Zero Gravity platform",
        },
        links: [
          {
            label: "hear the podcast",
            href: "https://open.spotify.com/episode/3D8quBCXrMNgIF87czhux3",
          },
        ],
      },
      {
        order: "04",
        name: "AI STEM tutor",
        image: {
          src: "work/tutor.jpg",
          alt: "Two screens of the Zero Gravity tutor app: the home screen asking what you want to learn today, and the subject picker",
        },
        ownership: "Led product and design · wrote 28% of merged code",
        problem: {
          title:
            "Students could get an AI-generated answer in seconds. Teachers could not see whether their students understood the method.",
        },
        bet: {
          title:
            "The tutor coaches towards the answer and refuses to hand it over.",
          points: [
            "Socratic by design: it asks the next question until the student gets there, and can't be talked into giving the answer.",
            "Coaching, practice, marking and assignments run as separate agents, each with its own evaluator.",
            "Marking tested against real past papers and official mark schemes, and it accepts alternative methods the way a teacher would.",
            "Grounded in each student's exam board and course: Maths, Physics, Chemistry and Biology for AQA, Edexcel, OCR and IB.",
            "Built to the DfE's 2026 safety standards for under-18s, with safeguarding concerns escalated to a named person.",
            "10,000 students by June 2026. Picked for the DfE Pioneers Programme eleven weeks after launch.",
          ],
          proof:
            "~67% → 99%+ on internal marking evals · App Store in under a month · 2nd of 8 in the DfE Pioneers Programme",
        },
        links: [
          {
            label: "view the product",
            href: "https://www.zerogravity.co.uk/tutor",
          },
          {
            label: "App Store",
            href: "https://apps.apple.com/gb/app/zero-gravity-tutor/id6760364095",
          },
          {
            label: "trust and safeguarding",
            href: "https://www.zerogravity.co.uk/tutor/trust",
          },
        ],
      },
      {
        order: "05",
        name: "School hub",
        ownership: "Led product and design · the B2B layer on the tutor",
        problem: {
          title:
            "One teacher, thirty students, one homework. They found out who was stuck at the next assessment, weeks after it mattered.",
        },
        bet: {
          title:
            "Same homework for the class, different help for each student, and the teacher sees who needs them before the next lesson.",
          points: [
            "Teachers build homework from their own material and send it in a click.",
            "Every student gets the same questions, coached at their own level.",
            "The teacher sees who has it, who needs another go and who's ready for more, the same day.",
            "A weekly summary per class names the gap and who to nudge. It drafts; the teacher decides.",
            "Heads of department see which topics are dragging, by subject, while there's still time to act.",
            "The DPIA pack, data flows and DfE standards mapping are written before a data lead asks.",
          ],
          proof:
            "850+ UK schools · 91% student activation via school referral · a named teacher on every flag",
        },
        links: [
          {
            label: "for teachers",
            href: "https://www.zerogravity.co.uk/tutor/teachers",
          },
          {
            label: "for school leaders",
            href: "https://www.zerogravity.co.uk/tutor/school-leaders",
          },
        ],
      },
    ],
  },
  {
    name: "Flash Pack",
    meta: "Founding Operator (#8) · 2018–20",
    stint: "2018–20",
    logo: "career/flash-pack.jpeg",
    products: [
      {
        order: "06",
        name: "Flash Pack Foundation",
        ownership: "Co-founder · 2019–20",
        image: {
          src: "work/flash-pack-foundation.jpg",
          alt: "The Flash Pack Foundation banner: a polar bear asleep on the ice, with the line small steps to big change",
        },
        problem: {
          title:
            "Adventure travel carries ethical baggage: price inflation, plastic waste and carbon, paid for by the places the trips go.",
        },
        bet: {
          title:
            "A foundation inside the company, with pledges a traveller could see on the trip itself.",
          points: [
            "Co-founded it, and worked with local partners on on-trip waste and community projects.",
            "Grassroots partners in education, human rights, gender empowerment and animal welfare.",
            "A carbon plan aimed at making Flash Pack carbon neutral.",
            "Refillable bottles instead of single-use plastic for every traveller and guide.",
          ],
          proof: "Co-founded 2019 · grassroots partners in key destinations",
        },
        links: [],
      },
      {
        order: "07",
        name: "CX and crisis operations",
        ownership: "Founding operator · built the service layer",
        image: {
          src: "work/flash-pack.jpg",
          alt: "A Flash Pack trip page for Borneo: Into the Jungle, with photos of rainforest, orangutans and a reef",
        },
        problem: {
          title:
            "Solo travellers in their 30s and 40s were trusting a young company with trips in more than 30 countries.",
        },
        bet: {
          title:
            "Build the customer and crisis operations as a system, so service scaled with the business.",
          points: [
            "Joined as hire #8 and built the customer and crisis operations.",
            "Scaled the team from 10 to 160 across 30+ markets.",
            "Owned the APAC and EMEA trip accounts and itineraries.",
            "Kept NPS above 90 through the US launch.",
          ],
          proof: "400% YoY growth · team 10 → 160 · NPS above 90 through the US launch",
        },
        links: [],
      },
    ],
  }
];

// Newest first: the tutor and its school hub, then back through the career.
const ORDER = [
  "AI STEM tutor",
  "School hub",
  "Career Co-pilot",
  "Learning pathways",
  "Probate operations",
  "Flash Pack Foundation",
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
  const headline = product.bet.proof?.split(" · ")[0];
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
          <span className="ws-bet">{product.bet.title}</span>
          {headline ? (
            <span className="ws-proof">{headline}</span>
          ) : (
            <span aria-hidden="true" />
          )}
          <span className="ws-plus" aria-hidden="true" />
        </button>
      </h3>

      <div className="ws-panel" id={id} role="region" aria-label={product.name}>
        <div className="ws-panel-in">
          <div className="ws-body">
            <span className="ws-role">{product.ownership}</span>
            <p className="ws-problem">
              <span className="ws-label">The problem</span>
              {product.problem.title}
            </p>
            <div className="ws-label">What I did</div>
            <ul className="ws-points">
              {product.bet.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
            {product.bet.lesson && (
              <p className="product-lesson">
                <span>What we learned</span>
                {product.bet.lesson}
              </p>
            )}
            {product.bet.proof && (
              <div className="case-spec-proof">
                {product.bet.proof.split(" · ").map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
            )}
            {product.links.length > 0 && (
              <div className="product-case-links">
                {product.links.map((link) => (
                  <a href={link.href} key={link.href}>
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
          {product.image && (
            <figure className="ws-shot">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${basePath}/${product.image.src}`}
                alt={product.image.alt}
                loading="lazy"
              />
            </figure>
          )}
        </div>
      </div>
    </article>
  );
}
