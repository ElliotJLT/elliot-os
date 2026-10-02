// The letters that turn into a mark on hover, shared by the nav and the
// footer. The link around each one carries .nav-loops-link or
// .nav-evals-link plus an aria-label; everything here is decorative.
// `first` lets the footer capitalise without a second copy of the SVG.

export function LoopsWord({ first = "l" }: { first?: string }) {
  return (
    <span className="nav-loops-label">
      <span aria-hidden="true">{first}</span>
      <span className="nav-loops-core" aria-hidden="true">
        <span className="nav-loops-plain">oo</span>
        <span className="nav-loops-mark">
          <span className="nav-loops-lemni">
            <svg viewBox="0 0 84 48" focusable="false">
              <path
                className="nav-loops-trace"
                d="M42 24 C42 9 58 5 68 11 C78 17 78 31 68 37 C58 43 42 39 42 24 C42 9 26 5 16 11 C6 17 6 31 16 37 C26 43 42 39 42 24 Z"
                pathLength={100}
              />
            </svg>
          </span>
        </span>
      </span>
      <span aria-hidden="true">ps</span>
    </span>
  );
}

// The v is already a tick: on hover it becomes one and draws once. Loops
// repeat, so its mark keeps tracing; an eval lands a verdict and stops.
export function EvalsWord({ first = "e" }: { first?: string }) {
  return (
    <span className="nav-loops-label">
      <span aria-hidden="true">{first}</span>
      <span className="nav-loops-core" aria-hidden="true">
        <span className="nav-loops-plain">v</span>
        <span className="nav-loops-mark">
          <span className="nav-evals-tick">
            <svg viewBox="0 0 36 48" focusable="false">
              <path
                className="nav-evals-draw"
                d="M4 27 L14 38 L32 8"
                pathLength={100}
              />
            </svg>
          </span>
        </span>
      </span>
      <span aria-hidden="true">als</span>
    </span>
  );
}
