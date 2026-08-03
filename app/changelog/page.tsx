import { getLog, type LogEntry } from "@/lib/gitlog";
import Reveal from "../components/Reveal";

export const metadata = { title: "Changelog · Elliot Little" };

export default function Changelog() {
  const log = getLog();
  const byDate: [string, LogEntry[]][] = [];
  for (const e of log) {
    const last = byDate[byDate.length - 1];
    if (last && last[0] === e.date) last[1].push(e);
    else byDate.push([e.date, [e]]);
  }

  return (
    <main>
      <div className="mai">
        <Reveal immediate>
          <header className="wr-head">
            <h1 className="wr-title rv-settle">Changelog</h1>
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              Every change to this site is a commit, badged by author. Agent
              commits come from the scheduled workflow; the badge is derived
              from the real git author field, so it can&apos;t be faked
              without showing up in the{" "}
              <a href="https://github.com/ElliotJLT/elliot-os/commits/main">
                history on GitHub
              </a>
              .
            </p>
          </header>
        </Reveal>

        <Reveal>
          <ol className="timeline rv-settle">
            {byDate.map(([date, entries]) => (
              <li key={date}>
                <div className="day">{date}</div>
                {entries.map((e) => {
                  const agent = e.author.includes("agent");
                  return (
                    <div className={"entry" + (agent ? " agent" : "")} key={e.hash}>
                      <a
                        className="hash"
                        href={`https://github.com/ElliotJLT/elliot-os/commit/${e.hash}`}
                      >
                        {e.hash}
                      </a>
                      <span className={"badge " + (agent ? "agent" : "human")}>
                        {agent ? "agent" : "human"}
                      </span>
                      <span className="subject">{e.subject}</span>
                    </div>
                  );
                })}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </main>
  );
}
