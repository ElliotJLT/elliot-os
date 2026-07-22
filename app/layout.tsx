import type { Metadata } from "next";
import Link from "next/link";
import { getSpend } from "@/lib/telemetry";
import "./globals.css";

const basePath = process.env.BASE_PATH || "";

export const metadata: Metadata = {
  title: "Elliot Little",
  description:
    "Builder-operator in London. This site runs like a product: live telemetry, a public roadmap, a changelog, and pages maintained by an agent that accounts for every token it spends.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const spend = getSpend();
  return (
    <html lang="en">
      <body>
        <nav>
          <div className="wrap">
            <Link href="/" className="brand">
              Elliot Little<span className="tag">operating report</span>
            </Link>
            <div className="links">
              <Link href="/built">built</Link>
              <Link href="/now">now</Link>
              <Link href="/next">next</Link>
              <Link href="/changelog">changelog</Link>
            </div>
          </div>
        </nav>
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
