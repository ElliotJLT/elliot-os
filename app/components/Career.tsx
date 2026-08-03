import type { Role } from "@/lib/roles";

/** Career as a card grid, not a rail of dots and rules — used both as the
 *  homepage snapshot and /built's full track record, so the two never
 *  drift out of sync with each other. */
export function CareerCards({ roles }: { roles: Role[] }) {
  return (
    <div className="career-snap">
      {roles.map((r) => (
        <div className="career-card" key={r.org}>
          <h3 className="career-co">
            {r.url ? <a href={r.url}>{r.org}</a> : r.org}
          </h3>
          {(r.role || r.dates) && (
            <span className="career-meta">
              {[r.role, r.dates].filter(Boolean).join(" · ")}
            </span>
          )}
          <p className="career-note">{r.outcome}</p>
        </div>
      ))}
    </div>
  );
}
