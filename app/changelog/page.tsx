import { getLog } from "@/lib/gitlog";

export const metadata = { title: "Changelog · Elliot Little" };

export default function Changelog() {
  const log = getLog();
  return (
    <main>
      <div className="wrap">
        <h1>Changelog</h1>
        <p className="muted">
          Every change to this site is a commit, badged by author. Agent
          commits come from the scheduled workflow; the badge is derived from
          the real git author field, so it can&apos;t be faked without showing
          up in the{" "}
          <a href="https://github.com/ElliotJLT/elliot-os/commits/main">
            history on GitHub
          </a>
          .
        </p>
        <ul className="log">
          {log.map((e) => (
            <li key={e.hash}>
              <span className="hash">{e.hash}</span>
              <span className="date">{e.date}</span>
              <span
                className={
                  "badge " + (e.author.includes("agent") ? "agent" : "human")
                }
              >
                {e.author.includes("agent") ? "agent" : "human"}
              </span>
              <span>{e.subject}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
