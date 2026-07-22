import type { Metadata } from "next";
import Link from "next/link";
import { Newsreader, Archivo } from "next/font/google";
import { getSpend } from "@/lib/telemetry";
import NavLinks from "./components/NavLinks";
import ThemeToggle from "./components/ThemeToggle";
import "./globals.css";

const basePath = process.env.BASE_PATH || "";

// Both self-hosted at build — no runtime third-party request, consistent
// with the site's no-external-anything rule. Newsreader is the editorial
// display serif; Archivo is a neutral Akzidenz-lineage grotesque for
// running text and UI (a free stand-in for Söhne's Swiss warmth).
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Elliot Little",
  description:
    "Builder-operator in London. This site runs like a product: live telemetry, a public roadmap, a changelog, and pages maintained by an agent that accounts for every token it spends.",
};

// Runs before paint so the stored theme never flashes.
const themeInit = `(function(){var e=document.documentElement;e.classList.add("js");try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}e.dataset.theme=t}catch(_){}})()`;

const issue = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const spend = getSpend();
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${archivo.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <header className="masthead">
          <div className="wrap">
            <div className="mast-top">
              <Link href="/" className="brand">
                Elliot Little
              </Link>
              <ThemeToggle />
            </div>
            <div className="mast-rule">
              <span className="mast-line">
                Operating Report · London · Est. MMXXVI
              </span>
              <span className="mast-issue">{issue.toUpperCase()}</span>
            </div>
            <nav className="mast-nav">
              <NavLinks />
            </nav>
          </div>
        </header>
        {children}
        <footer>
          <div className="wrap">
            <span>
              agent inference spend, all time: $
              {spend.totals.cost_usd.toFixed(4)} across {spend.totals.runs}{" "}
              run{spend.totals.runs === 1 ? "" : "s"} (
              {spend.totals.input_tokens + spend.totals.output_tokens} tokens).
              Measured, not estimated: <Link href="/changelog">receipts</Link>.
            </span>
            <span>
              <a href="https://github.com/ElliotJLT/elliot-os">source</a>
              {" · "}
              <a href="https://github.com/ElliotJLT">github</a>
              {" · "}
              <a href="https://www.linkedin.com/in/hireelliot/">linkedin</a>
              {" · "}
              <a href="https://medium.com/@elliotJL">medium</a>
              {" · "}
              <a href="mailto:elliotjlittle@gmail.com">email</a>
              {" · "}
              <a href={`${basePath}/llms.txt`}>llms.txt</a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
