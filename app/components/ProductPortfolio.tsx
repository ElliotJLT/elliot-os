"use client";

import { useState } from "react";

type View = "problem" | "bet";

type Product = {
  order: string;
  name: string;
  ownership: string;
  problem: {
    title: string;
    paragraphs: string[];
  };
  bet: {
    title: string;
    paragraphs: string[];
    proof?: string;
    lesson?: string;
  };
  links: { label: string; href: string }[];
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
        ownership: "Led product, operations and workflow design",
        problem: {
          title:
            "Families could not see the next step, and legal specialists spent expert time on administration.",
          paragraphs: [
            "Families must deal with assets, debts, tax, banks and the courts while grieving. Legal specialists spend hours chasing missing information and answering status questions instead of making the decisions that need their judgement.",
          ],
        },
        bet: {
          title:
            "We gave each case a structured path and the legal team an operating system.",
          paragraphs: [
            "I worked between customers, legal specialists and operations. We built guided intake that populated case data, automation and audit logs around the legal workflow, and a tracker that showed the next action and helped the team estimate the specialist time a case would need.",
            "I also shipped integrations with HMCTS, HMRC and banking services, reserving the legal team for decisions that needed their judgement.",
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
          paragraphs: [
            "Some students waited for a mentor; others had weeks between conversations. During that time the platform gave them little reason to return. Employer partners also needed a way to prepare more students for the opportunities they funded.",
          ],
        },
        bet: {
          title: "Partner-funded learning paths filled the gap.",
          paragraphs: [
            "In 2023 I led the team that shipped staged courses for partners including Accenture, HSBC, KPMG and Snap. They combined video, Duolingo-style progression, quizzes and an early AI skills check.",
            "The product gave students a self-serve layer alongside mentoring and gave commercial partners a concrete way to fund access and preparation.",
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
          paragraphs: [
            "We had built mentors, learning, opportunities and community advice into separate parts of the product. Students had to know what they needed and where to find it before Zero Gravity could help. Generic CV tools also replaced specific evidence with the same polished language.",
          ],
        },
        bet: {
          title: "Career Co-pilot turned the catalogue into a guided next step.",
          paragraphs: [
            "I designed and led the first end-to-end AI product on the platform. It used a student’s CV and Zero Gravity profile to build the CV with them, suggest relevant mentors and learning, retrieve useful community posts and answer career questions against platform knowledge.",
            "The CV grew with the student, and the co-pilot brought the next useful part of Zero Gravity into the conversation.",
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
        ownership: "Led product and design · wrote 28% of merged code",
        problem: {
          title:
            "Students could get an AI-generated answer in seconds. Teachers could not see whether their students understood the method.",
          paragraphs: [
            "Generic AI tools complete the work when a student asks, then hand over the final answer when pushed. Teachers support a full class and cannot coach each step or inspect every chat. They lose the evidence they need to tell whether a student understands the method.",
          ],
        },
        bet: {
          title:
            "The tutor coaches towards the answer and refuses to hand it over.",
          paragraphs: [
            "Coaching, practice, marking and assignments run as separate agents, each with its own pedagogy and evaluator. We test marking against past papers and official mark schemes, and record safety signals on each interaction. Built to the DfE's Generative AI Product Safety Standards for under-18s.",
            "We launched across Maths, Physics, Chemistry and Biology for AQA, Edexcel, OCR and IB, direct to students and through a school hub for teachers: 1,247 students by June 2026. Eleven weeks later, the government selected us for its AI Tutoring Tools Pioneers Programme: eight companies chosen nationally to test safe AI tutoring in schools. We placed 2nd, scoring ahead of frontier US labs and the largest UK curriculum incumbents.",
          ],
          proof:
            "~67% → 99%+ on internal marking evals · App Store in 45 days",
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
        ],
      },
    ],
  },
];

export default function ProductPortfolio({ basePath = "" }: { basePath?: string }) {
  // One grid of cases, each carrying its company, so all four sit on one
  // screen at desktop width. The company header rows they used to hang under
  // are folded into each card's eyebrow.
  // The tutor leads: it is the most recent, the most checked, and the one
  // both readers came for. The rest keep their order.
  const cases = COMPANIES.flatMap((company) =>
    company.products.map((product) => ({ company, product })),
  ).sort((a, b) => Number(b.product.name === "AI STEM tutor") - Number(a.product.name === "AI STEM tutor"));

  return (
    <div className="case-grid">
      {cases.map(({ company, product }) => (
        <ProductCase
          company={company}
          product={product}
          basePath={basePath}
          key={product.name}
        />
      ))}
    </div>
  );
}

function ProductCase({
  company,
  product,
  basePath,
}: {
  company: Company;
  product: Product;
  basePath: string;
}) {
  // The problem opens by default, so the card reads problem, bet, proof
  // without a click. Bet swaps the panel; the selected one again collapses
  // it. Nothing on the page is hidden behind a slide.
  const [view, setView] = useState<View | null>("problem");
  const copy: { title: string; paragraphs: string[]; lesson?: string } | null =
    view ? product[view] : null;
  const panelId = `product-${product.order}-copy`;
  const toggle = (next: View) => setView((v) => (v === next ? null : next));
  // One card per row. Every element has its own slot: the header carries
  // identity and role, a labelled row each for the bet and the proof, and a
  // footer with the Problem / Bet control on the left and links on the
  // right. The opened copy sits under the footer, beneath the control.
  return (
    <article className="case-card">
      <header className="case-card-head">
        <span className="portfolio-logo-shell">
          {/* The adjacent eyebrow names the company. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/${company.logo}`}
            alt=""
            width={48}
            height={48}
          />
        </span>
        <div className="case-card-id">
          <span className="case-card-company">
            {company.name} · {company.stint}
          </span>
          <h4>{product.name}</h4>
        </div>
        <span className="case-card-role">{product.ownership}</span>
      </header>

      <dl className="case-spec">
        <div className="case-spec-row">
          <dt>The bet</dt>
          <dd className="case-spec-statement">{product.bet.title}</dd>
        </div>
        {product.bet.proof && (
          <div className="case-spec-row">
            <dt>Proof</dt>
            <dd className="case-spec-proof">{product.bet.proof}</dd>
          </div>
        )}
      </dl>

      <div className="case-card-foot">
        <div
          className="product-case-toggle"
          role="group"
          aria-label={`Read the problem or the bet for ${product.name}`}
        >
          <button
            type="button"
            aria-controls={panelId}
            aria-expanded={view === "problem"}
            data-selected={view === "problem"}
            onClick={() => toggle("problem")}
          >
            Problem
          </button>
          <button
            type="button"
            aria-controls={panelId}
            aria-expanded={view === "bet"}
            data-selected={view === "bet"}
            onClick={() => toggle("bet")}
          >
            Bet
          </button>
        </div>
        <div className="product-case-links">
          {product.links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>

      {copy && view && (
        <div className="product-case-panel" id={panelId}>
          <span className="product-case-panel-label">
            {view === "problem" ? "The problem" : "The bet, in full"}
          </span>
          {view === "problem" && (
            <p className="product-case-statement">{copy.title}</p>
          )}
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {"lesson" in copy && copy.lesson && (
            <p className="product-lesson">
              <span>What we learned</span>
              {copy.lesson}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
