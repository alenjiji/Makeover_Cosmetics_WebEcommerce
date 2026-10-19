import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

// Timings and terms from the Contact page FAQ.
const steps = [
  {
    title: "Tell us about your clinic",
    text: "Share the treatments you offer or plan to offer. A call, a WhatsApp message or the contact form all work.",
  },
  {
    title: "Get honest advice & a quote",
    text: "Our specialists recommend the right configuration and reply with a tailored quote within 24 hours.",
  },
  {
    title: "Fast worldwide delivery",
    text: "Standard delivery in 7-15 business days after order confirmation, with express shipping available.",
  },
  {
    title: "Training & ongoing support",
    text: "Training materials, video tutorials, 24/7 technical support and a standard 1-2 year warranty.",
  },
];

/** Four stops on a route, like the trade routes in the footer: the buying journey. */
export function Process() {
  return (
    <section aria-labelledby="process" className="relative overflow-hidden bg-white px-6 py-24 md:px-10 md:py-32 xl:px-[60px]">
      <div aria-hidden="true" className="world-map absolute inset-x-0 top-1/2 mx-auto aspect-[262/124] w-[110%] max-w-[1500px] -translate-y-1/2 bg-navy/[.035]" />
      <div className="relative mx-auto max-w-[1640px]">
        <SectionHeader
          id="process"
          label="How It Works"
          title={
            <>
              From First Hello to <span className="italic text-accent">First Treatment</span>
            </>
          }
          subtitle="Buying professional equipment should feel simple. Here's what to expect when you reach out."
          className="mb-16 md:mb-24"
        />
        <Reveal as="ol" variant="none" className="relative grid gap-12 md:grid-cols-2 md:gap-x-10 xl:grid-cols-4 xl:gap-8">
          {/* The route between the stops (desktop): draws in, then a light travels along it. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 60"
            preserveAspectRatio="none"
            className="absolute left-[12.5%] right-[12.5%] top-3 hidden h-[60px] w-[75%] overflow-visible xl:block"
            fill="none"
          >
            <defs>
              <linearGradient id="process-route" x1="0" y1="0" x2="1" y2="0">
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
                stroke={layer ? "#e3c4bb" : "url(#process-route)"}
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
                <h3
                  style={{ "--i": i + 1 } as React.CSSProperties}
                  className="mb-3 font-display text-[24px] font-bold leading-snug text-ink"
                >
                  {step.title}
                </h3>
                <p style={{ "--i": i + 1.5 } as React.CSSProperties} className="text-[15px] leading-relaxed text-muted">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
