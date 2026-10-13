import { SplitWords } from "./SplitWords";

type Props = {
  badge: string;
  title: React.ReactNode;
  subtitle: string;
  children?: React.ReactNode;
};

export function PageHeader({ badge, title, subtitle, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-surface)_0%,#fff_100%)] px-6 pb-14 pt-[140px] text-center md:px-[60px] md:pb-16 md:pt-[184px]">
      {/* The logo's map, faint behind the title. */}
      <div
        aria-hidden="true"
        className="world-map pointer-events-none absolute left-1/2 top-20 aspect-[262/124] w-[max(720px,min(1100px,90%))] -translate-x-1/2 animate-fade bg-navy/[.05]"
      />
      <div className="relative mx-auto max-w-[820px]">
        <p className="eyebrow eyebrow-center mb-7 animate-pop-in">{badge}</p>
        <h1
          style={{ "--split-delay": "0.1s" } as React.CSSProperties}
          className="split-load opsz-auto mb-6 font-display text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-ink md:text-[52px] xl:text-[64px]"
        >
          <SplitWords>{title}</SplitWords>
        </h1>
        <p className="mx-auto max-w-[620px] animate-rise-in text-[15px] leading-[1.8] text-muted [--rise-delay:.45s] md:text-lg">
          {subtitle}
        </p>
        {children}
      </div>
    </section>
  );
}
