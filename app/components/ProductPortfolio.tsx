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
  logo: string;
  products: Product[];
};

const COMPANIES: Company[] = [
  {
    name: "Farewill",
    meta: "Product & Operations Lead · 2021–22",
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
            "Coaching, practice, marking and assignments run as separate agents, each with its own pedagogy and evaluator. We test marking against past papers and official mark schemes, and record safety signals on each interaction.",
            "We launched across Maths, Physics, Chemistry and Biology for AQA, Edexcel, OCR and IB, direct to students and through a school hub for teachers. Eleven weeks later, the government selected us for its AI Tutoring Tools Pioneers Programme: eight companies chosen nationally to test safe AI tutoring in schools. We placed 2nd, scoring ahead of frontier US labs and the largest UK curriculum incumbents.",
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
  return (
    <div className="product-portfolio">
      {COMPANIES.map((company) => (
        <section className="portfolio-company" key={company.name}>
          <header className="portfolio-company-head">
            <span className="portfolio-logo-shell">
              {/* The adjacent heading names the company. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${basePath}/${company.logo}`}
                alt=""
                width={48}
                height={48}
              />
            </span>
            <div>
              <h3>{company.name}</h3>
              <span>{company.meta}</span>
            </div>
          </header>

          <div className="product-case-list">
            {company.products.map((product) => (
              <ProductCase product={product} key={product.name} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ProductCase({ product }: { product: Product }) {
  const [view, setView] = useState<View>("bet");
  const copy = product[view];
  const panelId = `product-${product.order}-copy`;

  return (
    <article className="product-case-row">
      <div className="product-case-id">
        <span className="product-case-no">{product.order}</span>
        <h4>{product.name}</h4>
        <p className="product-ownership">{product.ownership}</p>
        <div
          className="product-case-toggle"
          role="group"
          aria-label={`Show the problem or bet for ${product.name}`}
        >
          <button
            type="button"
            aria-controls={panelId}
            aria-pressed={view === "problem"}
            data-selected={view === "problem"}
            onClick={() => setView("problem")}
          >
            Problem
          </button>
          <button
            type="button"
            aria-controls={panelId}
            aria-pressed={view === "bet"}
            data-selected={view === "bet"}
            onClick={() => setView("bet")}
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

      <div className="product-case-copy">
        <div className="product-case-panel" id={panelId}>
          <p className="product-case-statement">{copy.title}</p>
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {"lesson" in copy && copy.lesson && (
            <p className="product-lesson">
              <span>What we learned</span>
              {copy.lesson}
            </p>
          )}
          {"proof" in copy && copy.proof && (
            <p className="product-proof">{copy.proof}</p>
          )}
        </div>
      </div>
    </article>
  );
}
