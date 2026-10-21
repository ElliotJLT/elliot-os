// The letters that turn into a mark on hover, shared by the nav and the
// footer. The link around it carries .nav-evals-link plus an aria-label; everything here is decorative.
// `first` lets the footer capitalise without a second copy of the SVG.

// The v is already a tick: on hover it becomes one and draws once.
export function EvalsWord({ first = "e" }: { first?: string }) {
  return (
    <span className="nav-loops-label" data-i18n-skip="">
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
