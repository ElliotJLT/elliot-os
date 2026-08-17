const basePath = process.env.BASE_PATH || "";

export default function MentoringCards() {
  return (
    <div className="mentoring-grid">
      <article className="mentor-card">
        <div className="mentor-card-head">
          <span className="mentor-logo-shell">
            {/* The adjacent heading names the programme. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="mentor-logo"
              src={`${basePath}/mentoring/lennys-mentorship.svg`}
              alt=""
              width={52}
              height={52}
            />
          </span>
          <div>
            <h3>
              <a href="https://www.lennysmentors.com/">
                Lenny&apos;s Newsletter
              </a>
            </h3>
            <span className="mentor-meta">
              mentor &amp; mentee · 2024–present
            </span>
          </div>
        </div>
        <p>
          I help another operator work through a hard product or career
          decision, then bring my own.
        </p>
      </article>

      <article className="mentor-card">
        <div className="mentor-card-head">
          <span className="mentor-logo-shell">
            {/* The adjacent heading names the organisation. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="mentor-logo"
              src={`${basePath}/career/zero-gravity.jpeg`}
              alt=""
              width={52}
              height={52}
            />
          </span>
          <div>
            <h3>
              <a href="https://www.zerogravity.co.uk/">Zero Gravity</a>
            </h3>
            <span className="mentor-meta">mentor · 2022–present</span>
          </div>
        </div>
        <p>
          I coach students and early-career professionals from low-opportunity
          backgrounds through university and career decisions.
        </p>
      </article>
    </div>
  );
}
