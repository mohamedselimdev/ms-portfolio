/** Lightweight SVG line chart (no chart library) for daily views and visitors. */
export function TrafficChart({ days, locale, labels }: { days: { date: string; views: number; visitors: number }[]; locale: string; labels: { views: string; visitors: string } }) {
  const W = 600;
  const H = 200;
  const pad = { l: 34, r: 8, t: 10, b: 24 };
  const max = Math.max(4, ...days.map((d) => d.views));
  const nice = Math.ceil(max / 4) * 4;
  const x = (i: number) => pad.l + (i / (days.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / nice) * (H - pad.t - pad.b);
  const line = (key: "views" | "visitors") => days.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(" ");
  const area = `${line("views")} L${x(days.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const fmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", { day: "numeric", month: "short" });
  const ticks = [0, 7, 14, 21, 29];

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${labels.views} / ${labels.visitors}`} style={{ direction: "ltr" }}>
        <defs>
          <linearGradient id="tc-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line x1={pad.l} x2={W - pad.r} y1={y(nice * f)} y2={y(nice * f)} stroke="rgb(255 255 255 / 0.06)" />
            <text x={pad.l - 6} y={y(nice * f) + 3} textAnchor="end" fontSize="10" fill="var(--subtle)">
              {Math.round(nice * f)}
            </text>
          </g>
        ))}
        <path d={area} fill="url(#tc-fill)" />
        <path d={line("views")} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" />
        <path d={line("visitors")} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3" strokeLinejoin="round" />
        {ticks.map((i) => (
          <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--subtle)">
            {fmt.format(new Date(days[i].date))}
          </text>
        ))}
      </svg>
      <figcaption className="mt-2 flex gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-primary" /> {labels.views}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 border-t border-dashed border-accent" /> {labels.visitors}
        </span>
      </figcaption>
    </figure>
  );
}
