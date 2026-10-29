import { RouteSteps } from "@/components/ui/RouteSteps";
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
        <RouteSteps id="process" steps={steps} />
      </div>
    </section>
  );
}
