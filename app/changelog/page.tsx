import { getLog } from "@/lib/gitlog";

export const metadata = { title: "Changelog · Elliot Little" };

export default function Changelog() {
  const log = getLog();
  return (
    <main>
      <div className="wrap">
        <h1>Changelog</h1>
        <p className="muted">
          Every change to this site is a commit, whether a human or an agent
          made it. Rendered from git history at build time; the full trail is{" "}
          <a href="https://github.com/ElliotJLT/elliot-os/commits/main">
            on GitHub
          </a>
          .
        </p>
        <ul className="log">
          {log.map((e) => (
            <li key={e.hash}>
              <span className="hash">{e.hash}</span>
              <span className="date">{e.date}</span>
              <span>{e.subject}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
