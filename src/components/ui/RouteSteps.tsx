import { Reveal } from "./Reveal";

export type RouteStep = { title: string; text: string };

/**
 * Numbered stops joined by a route that draws in (desktop), like the trade routes in the
 * footer. Built for four steps; the route spans the first to the last column.
 */
export function RouteSteps({ steps, id }: { steps: RouteStep[]; id: string }) {
  return (
    <Reveal as="ol" variant="none" className="relative grid gap-12 md:grid-cols-2 md:gap-x-10 xl:grid-cols-4 xl:gap-8">
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 60"
        preserveAspectRatio="none"
        className="absolute left-[12.5%] right-[12.5%] top-3 hidden h-[60px] w-[75%] overflow-visible xl:block"
        fill="none"
      >
        <defs>
          <linearGradient id={`${id}-route`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#122b49" />
            <stop offset="0.6" stopColor="#645b67" />
            <stop offset="1" stopColor="#ca998e" />
          </linearGradient>
        </defs>
        {[0, 1].map((layer) => (
          <path
            key={layer}
            d="M0 30 C 110 -10, 220 -10, 333 30 S 556 70, 666 30 S 890 -10, 1000 30"
            pathLength={100}
            vectorEffect="non-scaling-stroke"
            className={layer ? "route-pulse" : "route"}
            stroke={layer ? "#e3c4bb" : `url(#${id}-route)`}
            strokeWidth={layer ? 3 : 1.5}
            strokeLinecap="round"
          />
        ))}
      </svg>
      {steps.map((step, i) => (
        <li key={step.title} className="group relative text-center" style={{ "--i": i } as React.CSSProperties}>
          <span className="pop relative mx-auto mb-7 flex size-[76px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0%,var(--color-mist)_70%)] font-display text-[30px] font-bold italic text-navy shadow-[0_14px_30px_rgb(18_43_73/0.12)] ring-[10px] ring-white transition-all duration-500 group-hover:bg-navy group-hover:bg-none group-hover:text-rose-light">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="stagger mx-auto max-w-[320px]">
            <p style={{ "--i": i + 0.5 } as React.CSSProperties} className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-deep">
              Step {i + 1}
            </p>
            <h3 style={{ "--i": i + 1 } as React.CSSProperties} className="mb-3 font-display text-[24px] font-bold leading-snug text-ink">
              {step.title}
            </h3>
            <p style={{ "--i": i + 1.5 } as React.CSSProperties} className="text-[15px] leading-relaxed text-muted">
              {step.text}
            </p>
          </div>
        </li>
      ))}
    </Reveal>
  );
}
