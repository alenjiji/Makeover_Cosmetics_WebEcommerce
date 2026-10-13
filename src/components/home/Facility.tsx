import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SplitWords } from "@/components/ui/SplitWords";

const facts: { value: React.ReactNode; label: string }[] = [
  { value: <><CountUp to={7000} grouped /> m²</>, label: "Self-owned manufacturing facility" },
  { value: <><CountUp to={50} />+</>, label: "Experienced professionals" },
  { value: <CountUp to={10} />, label: "R&D engineers" },
  { value: "ISO · CE", label: "Certified quality" },
];

export function Facility() {
  return (
    <section
      aria-labelledby="facility"
      className="theme-dark relative overflow-hidden bg-[linear-gradient(150deg,#0b1c31_0%,#122b49_100%)] px-6 py-20 text-white md:px-10 md:py-24 xl:px-[60px]"
    >
      <div aria-hidden="true" className="world-map absolute -right-[10%] top-1/2 aspect-[262/124] w-[80%] -translate-y-1/2 bg-white/[.04]" />
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-40 size-[520px] animate-blob rounded-full bg-[radial-gradient(circle,rgb(202_153_142/0.28),transparent_70%)] [animation-duration:24s]"
      />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <Reveal variant="none">
          <p className="pop eyebrow eyebrow-light mb-6">Built by us</p>
          <h2
            id="facility"
            className="mb-6 font-display text-[34px] font-bold leading-[1.12] tracking-[-0.01em] md:text-[48px]"
          >
            <SplitWords>
              Made in our own <span className="italic text-accent text-accent-light">modernized factory</span>
            </SplitWords>
          </h2>
          <p className="rise-late text-base leading-[1.8] text-white/80 md:text-[17px]">
            Our self-owned facility and in-house R&amp;D team mean consistent quality, and a support team
            that knows every machine we ship, from the first install to the thousandth treatment.
          </p>
        </Reveal>
        <Reveal variant="none">
          <dl className="stagger grid grid-cols-2 gap-px overflow-hidden rounded-[24px] bg-white/10 ring-1 ring-white/10">
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                style={{ "--i": i } as React.CSSProperties}
                className="flex flex-col-reverse bg-navy-deep/70 p-6 transition-colors duration-300 hover:bg-navy-deep/30 md:p-8"
              >
                <dt className="mt-2 text-[13px] leading-snug text-white/75 md:text-sm">{fact.label}</dt>
                <dd className="font-display text-[34px] font-bold text-rose-light md:text-[42px]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
