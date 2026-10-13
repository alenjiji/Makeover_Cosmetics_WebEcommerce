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

export function Process() {
  return (
    <section aria-labelledby="process" className="bg-white px-6 py-20 md:px-10 md:py-28 xl:px-[60px]">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader
          id="process"
          label="How It Works"
          title={
            <>
              From First Hello to <span className="italic text-accent">First Treatment</span>
            </>
          }
          subtitle="Buying professional equipment should feel simple. Here's what to expect when you reach out."
          className="mb-14 md:mb-20"
        />
        <Reveal as="ol" variant="none" className="relative grid gap-10 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {/* Connector that draws across as the section scrolls in (desktop only). */}
          <span
            aria-hidden="true"
            className="draw-x absolute left-7 right-0 top-7 hidden h-px bg-gradient-to-r from-navy via-rose to-rose/0 xl:block"
          />
          {steps.map((step, i) => (
            <li key={step.title} className="group relative" style={{ "--i": i } as React.CSSProperties}>
              <span className="pop relative mb-6 flex size-14 items-center justify-center rounded-full bg-navy font-display text-2xl font-bold italic text-white shadow-navy ring-8 ring-white transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-m">
                {i + 1}
              </span>
              <div className="stagger">
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
