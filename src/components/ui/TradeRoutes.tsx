import { Reveal } from "./Reveal";

/** Bounds of public/brand/world-map.svg (the logo's map), in its own units. */
const MAP = { x: 597.7, y: 377.1, w: 261.7, h: 123.5 };

/** Middle East to East Asia, framing the three markets in the logo. */
const REGION = { x: 735, y: 403, w: 95, h: 55 };

// Positions in map units, placed by eye on the logo's map.
const markets = [
  { name: "UAE", x: 760.2, y: 438.6, label: "left" },
  { name: "India", x: 775.5, y: 443.5, label: "below" },
  { name: "China", x: 798, y: 432, label: "right" },
] as const;

const [uae, india, china] = markets;

// Quadratic arcs that bow north, like flight paths on a flat map.
const routes = [
  `M${uae.x} ${uae.y} Q${(uae.x + india.x) / 2} ${uae.y - 9} ${india.x} ${india.y}`,
  `M${india.x} ${india.y} Q${(india.x + china.x) / 2} ${china.y - 12} ${china.x} ${china.y}`,
  `M${uae.x} ${uae.y} Q${(uae.x + china.x) / 2} ${uae.y - 26} ${china.x} ${china.y}`,
];

const pct = (value: number, start: number, size: number) => `${((value - start) / size) * 100}%`;

type Props = {
  /** Colour of the land, as a background utility (the map is a mask). */
  landClassName?: string;
  className?: string;
};

/**
 * The logo's world map with India, the UAE and China pinned and joined by routes that
 * draw in once scrolled into view. Decorative: the markets are also listed in text nearby.
 */
export function TradeRoutes({ landClassName = "bg-white/10", className = "" }: Props) {
  return (
    <Reveal variant="none" className={className}>
      <div
        aria-hidden="true"
        className="relative overflow-hidden"
        style={{ aspectRatio: `${REGION.w} / ${REGION.h}` }}
      >
        {/* Land fades out toward the edges so the crop has no hard frame. */}
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_closest-side_at_center,#000_55%,transparent)]">
          <div
            className={`world-map absolute ${landClassName}`}
            style={{
              left: pct(MAP.x, REGION.x, REGION.w),
              top: pct(MAP.y, REGION.y, REGION.h),
              width: `${(MAP.w / REGION.w) * 100}%`,
              height: `${(MAP.h / REGION.h) * 100}%`,
            }}
          />
        </div>
        <svg
          viewBox={`${REGION.x} ${REGION.y} ${REGION.w} ${REGION.h}`}
          className="absolute inset-0 size-full overflow-visible"
          fill="none"
        >
          <defs>
            <linearGradient id="route-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#e3c4bb" />
              <stop offset="1" stopColor="#ca998e" />
            </linearGradient>
          </defs>
          {routes.map((d, i) => (
            <g key={d} style={{ "--i": i } as React.CSSProperties}>
              <path
                d={d}
                pathLength={100}
                className="route"
                stroke="url(#route-stroke)"
                strokeWidth={0.35}
                strokeLinecap="round"
              />
              <path
                d={d}
                pathLength={100}
                className="route-pulse"
                stroke="#fff"
                strokeWidth={0.6}
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
        {markets.map((m, i) => (
          <span
            key={m.name}
            className="absolute"
            style={{ left: pct(m.x, REGION.x, REGION.w), top: pct(m.y, REGION.y, REGION.h) }}
          >
            <span
              className="absolute -left-1 -top-1 size-2 animate-ping-soft rounded-full bg-rose"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
            <span className="absolute -left-1 -top-1 size-2 rounded-full bg-rose ring-2 ring-navy-deep" />
            <span
              className={`absolute whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80 md:text-[11px] ${
                m.label === "left"
                  ? "right-3 top-0 -translate-y-1/2"
                  : m.label === "right"
                    ? "left-3 top-0 -translate-y-1/2"
                    : "left-0 top-3 -translate-x-1/2"
              }`}
            >
              {m.name}
            </span>
          </span>
        ))}
      </div>
    </Reveal>
  );
}
