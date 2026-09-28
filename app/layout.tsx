import type { Metadata } from "next";
import Link from "next/link";
import { Newsreader, Schibsted_Grotesk } from "next/font/google";
import NavLinks from "./components/NavLinks";
import ThemeToggle from "./components/ThemeToggle";
import MobileMenu from "./components/MobileMenu";
import { IconLink } from "./components/Icons";
import { Pill } from "./components/Frame";
import "./globals.css";

const basePath = process.env.BASE_PATH || "";

// Two families, both self-hosted at build (no runtime third-party request).
// Newsreader does every headline and the reading serif: variable, with the
// optical-size axis, so display sizes get its sharper high-contrast cut.
// Schibsted Grotesk, drawn for a Nordic newspaper group, does body, labels
// and UI. Monospace is kept for data only (--data in globals.css).
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
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
    "Hands-on AI product leader who finds the problem, builds close to the code and leads teams through production. Four times a founding hire.",
};

// Runs before paint so the stored theme never flashes.
const themeInit = `(function(){var e=document.documentElement;e.classList.add("js");try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}e.dataset.theme=t}catch(_){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${schibsted.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {/* Floating pill masthead, inset from the top the way MAI's is,
            rather than a full-bleed bar welded to the viewport edge. */}
        <header className="mai-nav">
          <div className="mai-nav-inner">
            <Link href="/" className="mai-brand">
              Elliot Little
            </Link>
            <nav className="mai-links">
              <NavLinks basePath={basePath} />
            </nav>
            <ThemeToggle />
            <MobileMenu />
            <Pill href="mailto:elliotjlittle@gmail.com" tone="solid">
              Get in touch
            </Pill>
          </div>
        </header>
        {children}
        {/* The footer is the last thing anyone reads and the place they decide
            whether to write, so it carries every way to reach him. */}
        <footer>
          <div className="wrap">
            {/* The homepage used to close with its own call to action and
                contribution count, then the footer said the same thing again.
                One closing block. */}
            <div className="foot-cta">
              <div className="band-cta">
                <Pill
                  href="mailto:elliotjlittle@gmail.com"
                  tone="solid"
                  icon="mail"
                >
                  Email me
                </Pill>
                <Pill
                  href="https://cal.com/elliotjl/30min"
                  tone="soft"
                  icon="coffee"
                >
                  Book a coffee
                </Pill>
              </div>
            </div>
            <div className="foot-cols">
              <nav className="foot-col">
                <span className="foot-h">Sections</span>
                <Link href="/built">Built</Link>
                <Link href="/writing">Writing</Link>
                <Link href="/loops">Loops</Link>
              </nav>
              <div className="foot-col">
                <span className="foot-h">The desk</span>
                <span>London, UK</span>
                <a href="mailto:elliotjlittle@gmail.com">
                  elliotjlittle@gmail.com
                </a>
              </div>
              <nav className="foot-col">
                <span className="foot-h">Elsewhere</span>
                <div className="icorow">
                  <IconLink name="GitHub" href="https://github.com/ElliotJLT" />
                  <IconLink
                    name="LinkedIn"
                    href="https://www.linkedin.com/in/hireelliot/"
                  />
                  <IconLink
                    name="Bluesky"
                    href="https://bsky.app/profile/8lliot.bsky.social"
                  />
                  <IconLink name="Medium" href="https://medium.com/@elliotJL" />
                </div>
                <a href={`${basePath}/llms.txt`}>llms.txt</a>
              </nav>
            </div>
            <div className="foot-base">
              <a href="https://github.com/ElliotJLT/elliot-os">
                source for this site
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
