"use client";

import { useState } from "react";


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
        image: {
          src: "work/tutor.jpg",
          alt: "Two screens of the Zero Gravity tutor app: the home screen asking what you want to learn today, and the subject picker",
        },
        ownership: "Led product and design · wrote 28% of merged code",
        problem: {
          title:
            "Students could get an AI-generated answer in seconds. Teachers could not see whether their students understood the method.",
          paragraphs: [
            "Generic AI tools complete the work when a student asks, then hand over the final answer when pushed. Reading a solution is passive, so the learning stops there. A teacher with thirty students cannot coach each step or read every chat, and loses the evidence they need to tell whether a student understands the method or has copied one.",
            "The stakes are exam marks. A tutor that confidently teaches something the mark scheme will penalise is worse than no tutor, because the student cannot tell and finds out in the exam hall.",
          ],
        },
        bet: {
          title:
            "The tutor coaches towards the answer and refuses to hand it over.",
          paragraphs: [
            "The Socratic method is architectural, not a prompt: the tutor asks the next question until the student gets there themselves, and cannot be talked into handing over the answer. Coaching, practice, marking and assignments run as separate agents, each with its own pedagogy and evaluator. Marking is tested against real past papers and official mark schemes, and it recognises alternative methods the way a teacher would. A student can type the question or snap a photo of handwritten working.",
            "Every answer is grounded in the exact exam board and course a student is taught. It remembers what each student understands, where they slipped and what helped, and adjusts next time. We launched across Maths, Physics, Chemistry and Biology for AQA, Edexcel, OCR and IB, direct to students and through the school hub below: 10,000 students by June 2026.",
            "Built to the DfE's 2026 generative AI product safety standards for under-18s: content guardrails, session cut-offs, usage limits for younger students, the tutor never presenting itself as human, and a safeguarding concern cutting the session and escalating to a named person rather than a transcript dump. Student data is never used to train external models. Eleven weeks after launch, the government selected us for its AI Tutoring Tools Pioneers Programme, eight companies chosen nationally to test safe AI tutoring in schools. We placed 2nd, ahead of frontier US labs and the largest UK curriculum incumbents.",
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
          paragraphs: [
            "Homework help from a chatbot is a black box: the teacher sees a finished answer and nothing of the thinking. Coaching each student at their own level is what every teacher would do with the time, and no one has it. Interventions that could change a grade happen after the window has closed.",
            "Schools also cannot say yes to AI without paper: a DPIA, a data lead's questions, a governor asking why. The product had to be defensible before it could be useful.",
          ],
        },
        bet: {
          title:
            "Same homework for the class, different help for each student, and the teacher sees who needs them before the next lesson.",
          paragraphs: [
            "Teachers build homework from their own material and send it in a click. Every student does the same questions and is coached through them at their own level. As the work comes in, the teacher sees who has it, who needs another go and who is ready for more, the same day rather than at the next assessment. A weekly summary per class names the gap, the students to nudge and the ones to stretch. It drafts; the teacher decides.",
            "Heads of department see which topics are dragging a class or a school, by subject, while there is still time to act. A lesson builder turns a topic and a level into a plan, slides and a worksheet grounded in the specification, tuned by the misconceptions the tutor has already seen. Access is scoped by role: a subject teacher, a form tutor and a senior leader each see what their job needs, and safeguarding flags go only to the staff the school names.",
            "Deployment is teachers first, class by class, with whole-school access agreed with leadership. The DPIA pack, data flow maps and the mapping to the DfE 2026 standards are written before a data lead asks for them, because data protection is the thing that stops a school saying yes.",
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
          paragraphs: [
            "Flash Pack's travellers loved the places they visited. The business model that took them there added to the problem: flights, single-use plastic on every trip, and money that often skipped the communities hosting them.",
          ],
        },
        bet: {
          title:
            "A foundation inside the company, with pledges a traveller could see on the trip itself.",
          paragraphs: [
            "I co-founded the Flash Pack Foundation and worked with local partners to cut on-trip waste and back community projects in key destinations.",
            "Its pledges: give back through grassroots projects in education, human rights, gender empowerment and animal welfare; cut the company's carbon footprint towards carbon neutral; and swap single-use plastic bottles for refillables for every traveller and guide.",
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
          paragraphs: [
            "Every trip is a promise kept by people on the ground in another time zone. As the business grew fast, the service behind it had to grow without the experience slipping, including when a trip went wrong.",
          ],
        },
        bet: {
          title:
            "Build the customer and crisis operations as a system, so service scaled with the business.",
          paragraphs: [
            "I joined as hire #8 and built the CX and crisis operations systems behind the growth, scaling the team from 10 to 160 across 30+ markets. I owned the APAC and EMEA trip accounts and itineraries.",
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
            <div className="ws-label">The bet</div>
            {product.bet.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
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
