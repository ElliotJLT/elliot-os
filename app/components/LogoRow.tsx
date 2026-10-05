const basePath = process.env.BASE_PATH || "";

/* One colour, set by the band: each SVG is used as a mask, so the logo takes
   --band-sub in both themes. Heights are optical, not equal: a long thin
   wordmark at the same height as a square mark reads twice as loud. */
type Logo = { name: string; file: string; ratio: number; height: number };

const LOGOS: Logo[] = [
  { name: "HSBC", file: "hsbc.svg", ratio: 315.9 / 85, height: 21 },
  { name: "KPMG", file: "kpmg.svg", ratio: 80.58 / 32.08, height: 22 },
  { name: "Accenture", file: "accenture.svg", ratio: 163.4 / 43, height: 21 },
  { name: "Snap Inc.", file: "snap.svg", ratio: 89 / 22, height: 18 },
  { name: "Mercedes-AMG Petronas F1 Team", file: "amg-f1.svg", ratio: 358 / 112, height: 27 },
  { name: "NHS", file: "nhs.svg", ratio: 370.61 / 150, height: 19 },
];

function Mark({ name, file, ratio, height }: Logo) {
  return (
    <span
      className="logo-mark"
      {...(name ? { role: "img", "aria-label": name } : { "aria-hidden": true })}
      style={{
        height,
        width: Math.round(height * ratio),
        WebkitMaskImage: `url(${basePath}/logos/${file})`,
        maskImage: `url(${basePath}/logos/${file})`,
      }}
    />
  );
}

export default function LogoRow({ className = "" }: { className?: string }) {
  return (
    <ul className={`logo-row ${className}`}>
      <li className="logo-dfe" role="img" aria-label="Department for Education">
        <Mark name="" file="govuk-crest.svg" ratio={125 / 102} height={26} />
        <span aria-hidden="true">
          Department
          <br />
          for Education
        </span>
      </li>
      {LOGOS.map((l) => (
        <li key={l.file}>
          <Mark {...l} />
        </li>
      ))}
    </ul>
  );
}
