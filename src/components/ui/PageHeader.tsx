import { SplitWords } from "./SplitWords";

type Props = {
  badge: string;
  title: React.ReactNode;
  subtitle: string;
  children?: React.ReactNode;
};

/**
 * Navy page opener, matching the home hero: the logo's map, the M's rose glowing in from a
 * corner and light type. The navbar sits over it in its light state (see Navbar's
 * `navyTopPages`, which must list every page that uses this header).
 */
export function PageHeader({ badge, title, subtitle, children }: Props) {
  return (
    <section className="theme-dark relative overflow-hidden bg-[linear-gradient(170deg,#0b1c31_0%,#122b49_55%,#1d3352_100%)] px-6 pb-16 pt-[140px] text-center md:px-[60px] md:pb-20 md:pt-[190px]">
      <div
        aria-hidden="true"
        className="world-map pointer-events-none absolute left-1/2 top-16 aspect-[262/124] w-[max(760px,min(1200px,95%))] -translate-x-1/2 animate-fade bg-white/[.07]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 -right-40 size-[560px] animate-blob rounded-full bg-[radial-gradient(circle,rgb(202_153_142/0.32),transparent_65%)] [animation-duration:24s]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-24 size-[420px] rounded-full bg-[radial-gradient(circle,rgb(100_91_103/0.35),transparent_70%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rose/60 to-transparent" />

      <div className="relative mx-auto max-w-[860px]">
        <p className="eyebrow eyebrow-center eyebrow-light mb-7 animate-pop-in">{badge}</p>
        <h1
          style={{ "--split-delay": "0.1s" } as React.CSSProperties}
          className="split-load mb-6 font-display text-[40px] font-bold leading-[1.08] tracking-[-0.01em] text-white md:text-[56px] xl:text-[68px]"
        >
          <SplitWords>{title}</SplitWords>
        </h1>
        <p className="mx-auto max-w-[620px] animate-rise-in text-base leading-[1.8] text-white/75 [--rise-delay:.45s] md:text-lg">
          {subtitle}
        </p>
        {children}
      </div>
    </section>
  );
}
