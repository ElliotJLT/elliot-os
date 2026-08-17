import type { Role } from "@/lib/roles";

/** Career as a card grid, not a rail of dots and rules — used both as the
 *  homepage snapshot and /built's full track record, so the two never
 *  drift out of sync with each other. */
export function CareerCards({ roles }: { roles: Role[] }) {
  const basePath = process.env.BASE_PATH || "";

  return (
    <div className="career-snap">
      {roles.map((r) => (
        <div className="career-card" key={r.org}>
          <div className="career-card-head">
            {r.logo && (
              // The adjacent heading already names the company.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="career-logo"
                src={`${basePath}/${r.logo}`}
                alt=""
                width={48}
                height={48}
              />
            )}
            <div>
              <h3 className="career-co">
                {r.url ? <a href={r.url}>{r.org}</a> : r.org}
              </h3>
              {(r.role || r.dates) && (
                <span className="career-meta">
                  {[r.role, r.dates].filter(Boolean).join(" · ")}
                </span>
              )}
            </div>
          </div>
          <p className="career-note">{r.outcome}</p>
        </div>
      ))}
    </div>
  );
}
