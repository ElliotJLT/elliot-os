/**
 * The eval loop, drawn in the site's own type and ink rather than as an
 * image, so it sits on the page instead of in a box and follows the theme.
 * Six steps evenly round an ellipse, arcs between them, the bar in the
 * middle. Phones get the numbered list underneath instead: at that width
 * the labels would drop below the 11px floor.
 */
const CX = 380;
const CY = 250;
const RX = 290;
const RY = 185;
const GAP = 19; // degrees of arc left clear either side of each label

const point = (deg: number, rx = RX, ry = RY) => {
  const r = (deg * Math.PI) / 180;
  return [CX + rx * Math.cos(r), CY + ry * Math.sin(r)] as const;
};

export default function EvalLoop({ steps }: { steps: string[] }) {
  const angles = steps.map((_, i) => -90 + (360 / steps.length) * i);

  return (
    <svg
      className="ev-loop"
      viewBox="0 0 760 500"
      role="img"
      aria-label={`A loop: ${steps.join(", then ")}, then back to ${steps[0]}. In the middle: the bar.`}
    >
      <defs>
        <marker
          id="ev-arrow"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M1 1 L8 5 L1 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {angles.map((a, i) => {
        const from = point(a + GAP);
        const to = point(angles[(i + 1) % angles.length] + (i + 1 === angles.length ? 360 : 0) - GAP);
        return (
          <path
            key={`arc-${i}`}
            className="ev-loop-arc"
            d={`M ${from[0]} ${from[1]} A ${RX} ${RY} 0 0 1 ${to[0]} ${to[1]}`}
            markerEnd="url(#ev-arrow)"
          />
        );
      })}

      {steps.map((s, i) => {
        const [x, y] = point(angles[i]);
        return (
          <g key={s} transform={`translate(${x} ${y})`}>
            <text className="ev-loop-no" y={-16} textAnchor="middle">
              {String(i + 1).padStart(2, "0")}
            </text>
            <text className="ev-loop-label" y={10} textAnchor="middle">
              {s}
            </text>
          </g>
        );
      })}

      <g transform={`translate(${CX} ${CY})`}>
        <circle className="ev-loop-bar-ring" r={46} />
        <path
          className="ev-loop-tick"
          d="M -18 0 L -5 13 L 20 -14"
        />
        <text className="ev-loop-bar" y={82} textAnchor="middle">
          the bar
        </text>
      </g>
    </svg>
  );
}
