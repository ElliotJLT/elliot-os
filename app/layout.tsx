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
  // Explicit paths rather than app/icon.png: a static export under a basePath
  // does not rewrite metadata icon URLs, so they are prefixed here.
  icons: {
    icon: [
      { url: `${basePath}/icon-32.png`, sizes: "32x32", type: "image/png" },
      { url: `${basePath}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${basePath}/favicon.ico`, sizes: "any" },
    ],
    apple: [{ url: `${basePath}/icon-180.png`, sizes: "180x180" }],
  },
  description:
    "Builder-operator in London who ships AI products and the systems around them. One idea built five times: make the judgement legible before the output ships. This site is instrumented like the products, with live telemetry, a changelog, and surfaces maintained by an agent that meters every token it spends.",
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
              agent activity, all time: {spend.totals.runs} run
              {spend.totals.runs === 1 ? "" : "s"},{" "}
              {(
                spend.totals.input_tokens + spend.totals.output_tokens
              ).toLocaleString()}{" "}
              tokens metered. Measured, not estimated:{" "}
              <Link href="/changelog">receipts</Link>.
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
