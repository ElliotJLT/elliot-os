"use client";

import { useState } from "react";


type Product = {
  order: string;
  name: string;
  /** What it is and who it's for, in one plain sentence. */
  summary: string;
  /** What it achieved, as a number or short phrase and a plain label. */
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
    name: "Farewill",
    stint: "2021–22",
    logo: "career/farewill.jpeg",
    products: [
      {
        order: "01",
        name: "Probate operations",
        summary:
          "Farewill's probate service, which helps grieving families through the legal work of settling an estate.",
        outcomes: [
          { n: "69%", label: "fewer errors by case agents" },
          { n: "2 weeks → 4 days", label: "to handle a case" },
        ],
        how: [
          "A guided intake, and a tracker showing every case's next step.",
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
    stint: "2022–26",
    logo: "career/zero-gravity.jpeg",
    products: [
      {
        order: "02",
        name: "Learning pathways",
        summary:
          "Short, partner-funded courses that gave students something useful to do between mentoring sessions.",
        outcomes: [],
        how: [
          "Built with partners including Accenture, HSBC, KPMG and Snap.",
          "Video, bite-size progression, quizzes and an early AI skills check.",
        ],
        role: "Led product and design",
        lesson:
          "Students didn't come back to browse. That miss shaped Career Co-pilot: bring the next useful thing to the student.",
        links: [
          { label: "see learning at Zero Gravity", href: "https://www.zerogravity.co.uk/" },
        ],
      },
      {
        order: "03",
        name: "Career Co-pilot",
        summary:
          "An AI career assistant that builds a student's CV with them and points them to the right mentors and learning.",
        outcomes: [{ n: "First", label: "end-to-end AI product on the platform" }],
        how: [
          "Builds the CV from what the student has actually done, never invented experience.",
          "Suggests mentors, learning and useful community posts.",
          "Answers career questions from the platform's own knowledge.",
        ],
        role: "Led product, design and delivery",
        links: [
          { label: "hear the podcast", href: "https://open.spotify.com/episode/3D8quBCXrMNgIF87czhux3" },
        ],
      },
      {
        order: "04",
        name: "AI STEM tutor",
        summary:
          "An AI tutor for GCSE and A-level students that coaches them to the answer instead of handing it over.",
        outcomes: [
          { n: "2nd of 8", label: "in the UK government's AI tutoring programme" },
          { n: "10,000", label: "students by June 2026" },
          { n: "Under a month", label: "from first commit to the App Store" },
        ],
        how: [
          "Asks the next question until the student gets there, and won't give the answer away.",
          "Marks work against the exam boards' own mark schemes.",
          "Built to the Department for Education's safety standards for under-18s.",
        ],
        role: "Led product and design, and wrote 28% of the code",
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
      {
        order: "05",
        name: "School hub",
        summary:
          "The teacher's side of the tutor: one homework for the class, help at each student's level, and the teacher sees who's stuck the same day.",
        outcomes: [
          { n: "850+", label: "UK schools" },
          { n: "91%", label: "of students active when their school referred them" },
        ],
        how: [
          "Homework built from the teacher's own material and sent in a click.",
          "A weekly summary per class: who to nudge, who to stretch.",
          "Data-protection paperwork ready before a school asks for it.",
        ],
        role: "Led product and design",
        links: [
          { label: "for teachers", href: "https://www.zerogravity.co.uk/tutor/teachers" },
          { label: "for school leaders", href: "https://www.zerogravity.co.uk/tutor/school-leaders" },
        ],
      },
    ],
  },
  {
    name: "Flash Pack",
    stint: "2018–20",
    logo: "career/flash-pack.jpeg",
    products: [
      {
        order: "06",
        name: "Flash Pack Foundation",
        summary:
          "Flash Pack's social-impact arm, set up so the trips gave back to the places they visited.",
        outcomes: [{ n: "Co-founded", label: "in 2019" }],
        how: [
          "Grassroots partners in education, human rights, gender empowerment and animal welfare.",
          "A carbon plan aimed at making the company carbon neutral.",
          "Refillable bottles instead of single-use plastic on every trip.",
        ],
        role: "Co-founder",
        image: {
          src: "work/flash-pack-foundation.jpg",
          alt: "The Flash Pack Foundation banner: a polar bear asleep on the ice, with the line small steps to big change",
        },
        links: [],
      },
      {
        order: "07",
        name: "CX and crisis operations",
        summary:
          "The customer and crisis operations behind Flash Pack's small-group trips for solo travellers in their 30s and 40s.",
        outcomes: [
          { n: "400%", label: "year-on-year growth" },
          { n: "10 → 160", label: "people, across 30+ markets" },
          { n: "90+", label: "NPS, held through the US launch" },
        ],
        how: [
          "Built the customer and crisis operations as the company scaled.",
          "Owned the APAC and EMEA trip accounts.",
        ],
        role: "Founding operator, hire #8",
        image: {
          src: "work/flash-pack.jpg",
          alt: "A Flash Pack trip page for Borneo: Into the Jungle, with photos of rainforest, orangutans and a reef",
        },
        links: [],
      },
    ],
  },
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
            <p className="ws-foot">
              <span>{product.role}</span>
              {product.links.map((link) => (
                <a href={link.href} key={link.href}>
                  {link.label} ↗
                </a>
              ))}
            </p>
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
