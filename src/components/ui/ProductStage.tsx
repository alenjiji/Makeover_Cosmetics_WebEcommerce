import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  /** Extra classes for the image (e.g. reveal or hover motion). */
  imageClassName?: string;
  /** Disc diameter as a share of the stage. */
  disc?: "md" | "lg";
  className?: string;
  children?: React.ReactNode;
};

/**
 * A product shot standing on the logo's mist disc, ringed by a slowly turning rose orbit.
 * The stage fills its parent; give the parent a size or aspect ratio.
 */
export function ProductStage({
  src,
  alt,
  sizes,
  preload = false,
  imageClassName = "",
  disc = "md",
  className = "",
  children,
}: Props) {
  const size = disc === "lg" ? "size-[88%]" : "size-[78%]";
  return (
    <div className={`relative isolate ${className}`}>
      {/* Clipped: the spinning ring's square box would otherwise poke out mid-rotation. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div
          className={`${size} rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0%,var(--color-mist)_55%,#dfe2e1_100%)] shadow-[inset_0_-12px_30px_rgb(18_43_73/0.06)] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]`}
        />
        <div
          className={`orbit absolute ${disc === "lg" ? "size-[96%]" : "size-[88%]"} rounded-full border border-dashed border-rose/45`}
        />
      </div>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={`object-contain p-[12%] mix-blend-multiply ${imageClassName}`}
      />
      {children}
    </div>
  );
}
