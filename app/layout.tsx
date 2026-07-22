import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const basePath = process.env.BASE_PATH || "";

export const metadata: Metadata = {
  title: "Elliot Little",
  description:
    "Builder-operator in London. I ship AI products and the systems around them. This site runs like a product: live projects, a public roadmap, pages maintained by agents.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <nav>
          <div className="wrap">
            <Link href="/" className="brand">
              elliot@littleos:~$
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
              inference spent keeping this site current today: £0.00 (counter
              wires up when the agents take over, see{" "}
              <Link href="/next">next</Link>)
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
