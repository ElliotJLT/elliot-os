"use client";

import { useEffect, useState } from "react";

type Hour = { hour: number; hours: number; artist: string | null };

const clock = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Europe/London",
});

/**
 * The page's one live moment: what fourteen years of plays say Elliot is
 * likely listening to at this hour, London time, beside the day it came from.
 * Before hydration it shows the afternoon, which is when most of the
 * listening happens, so the static HTML still says something true.
 */
export default function ListeningNow({ hourly }: { hourly: Hour[] }) {
  const [now, setNow] = useState<{ time: string; hour: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const time = clock.format(new Date());
      setNow({ time, hour: Number(time.slice(0, 2)) });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const peak = hourly.reduce((a, b) => (b.hours > a.hours ? b : a));
  const max = peak.hours;
  const at = now ? hourly[now.hour] : null;

  return (
    <>
      <p className="sec-title rv-settle" aria-live="polite">
        {at?.artist ? (
          <>
            It&apos;s {now!.time} in London. At this hour I&apos;m usually
            playing {at.artist}.
          </>
        ) : (
          <>Afternoons are {peak.artist}.</>
        )}
      </p>
      <div className="ls-day rv-settle" role="list" aria-label="Hours played at each hour of the day, London time">
        {hourly.map((h) => (
          <div
            key={h.hour}
            role="listitem"
            tabIndex={0}
            className={"ls-day-bar" + (now?.hour === h.hour ? " is-now" : "")}
            aria-label={`${String(h.hour).padStart(2, "0")}:00, ${h.hours.toLocaleString("en-GB")} hours, mostly ${h.artist}`}
          >
            <span className="ls-day-fill" style={{ height: `${Math.max(2, (h.hours / max) * 100)}%` }} />
            <span className="ls-tip" aria-hidden="true">
              <b>{String(h.hour).padStart(2, "0")}:00</b>
              {h.hours.toLocaleString("en-GB")} hours
              <span>{h.artist}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="ls-day-axis rv-settle" aria-hidden="true">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
    </>
  );
}
