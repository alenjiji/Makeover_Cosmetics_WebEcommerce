import { Reveal } from "./Reveal";
import { SplitWords } from "./SplitWords";

type Props = {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  id?: string;
  /** "light" for navy sections (pair with `theme-dark` on the section). */
  tone?: "dark" | "light";
  className?: string;
};

/**
 * Eyebrow label + display title. On scroll the label pops in, the title rises word by word
 * and the subtitle follows.
 */
export function SectionHeader({ label, title, subtitle, align = "center", id, tone = "dark", className = "" }: Props) {
  const centered = align === "center";
  const light = tone === "light";
  return (
    <Reveal variant="none" className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <p className={`pop eyebrow mb-6 ${centered ? "eyebrow-center" : ""} ${light ? "eyebrow-light" : ""}`}>{label}</p>
      <h2
        id={id}
        className={`mb-5 font-display text-[34px] font-bold leading-[1.12] tracking-[-0.01em] md:text-[46px] xl:text-[54px] ${
          light ? "text-white" : "text-ink"
        }`}
      >
        <SplitWords>{title}</SplitWords>
      </h2>
      {subtitle && (
        <p
          className={`rise-late text-base leading-[1.8] md:text-[17px] ${centered ? "mx-auto max-w-[620px]" : ""} ${
            light ? "text-white/75" : "text-muted"
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
