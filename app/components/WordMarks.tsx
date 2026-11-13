// The nav and footer label for /evals, with a tick that draws itself in on
// hover. The link around it carries .nav-evals-link plus an aria-label;
// everything here is decorative. `first` lets the footer capitalise.

// The tick sits in a cell reserved after the words, so the nav never shifts
// when it appears.
export function CheckWord({ first = "h" }: { first?: string }) {
  return (
    <span className="nav-loops-label" data-i18n-skip="">
      <span aria-hidden="true">{first}ow I check</span>
      <span className="nav-loops-core nav-check-core" aria-hidden="true">
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
    </span>
  );
}
