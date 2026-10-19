import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { SplitWords } from "@/components/ui/SplitWords";
import { ProductStage } from "@/components/ui/ProductStage";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Spotlight = {
  slug: string;
  eyebrow: string;
  name: string;
  lead: string;
  stats: [string, string][];
  points: string[];
  image: { src: string; alt: string; width: number; height: number };
  detail?: { src: string; alt: string; width: number; height: number; caption: string };
};

// Copy and figures from the Seductive brochures in assets/source.
const spotlights: Spotlight[] = [
  {
    slug: "2-in-1-diode-nd-yag-laser",
    eyebrow: "Laser platform",
    name: "2-in-1 Diode + Nd:YAG Laser",
    lead: "Permanent hair removal and Q-switched tattoo and pigment removal on one platform, using less floor space than two single-function machines.",
    stats: [
      ["3000W", "Power"],
      ["4 + 4", "Wavelengths"],
      ["20×40mm", "Max spot"],
      ['15.6"', "Touch screen"],
    ],
    points: [
      "Diode 755/808/940/1064nm for all skin types (I–VI) and hair types",
      "Nd:YAG 532/755/1064/1320nm for pigments of all colours",
      "US Coherent laser with five interchangeable treatment heads",
      "Water + fans + semiconductor cooling, with double water filtration",
    ],
    image: { src: "/images/products/diode-yag-2in1.webp", alt: "2-in-1 diode and Nd:YAG laser machine", width: 625, height: 1200 },
    detail: {
      src: "/images/home/diode-heads.webp",
      alt: "Five diode laser treatment heads from 8mm to 20×40mm",
      width: 1200,
      height: 363,
      caption: "Five treatment heads, Φ8mm to 20×40mm",
    },
  },
  {
    slug: "emrf-m8-rf-microneedling",
    eyebrow: "Skin tightening",
    name: "EMRF M8 RF Microneedling",
    lead: "Two treatments in one cabinet: non-invasive monopolar RF to tighten and lift, and insulated gold-plated RF microneedling for deeper remodelling.",
    stats: [
      ["4MHz", "RF output"],
      ["0.5–7mm", "Needle depth"],
      ["10–300W", "Power"],
      ['10.4"', "Touch screen"],
    ],
    points: [
      "Fine lines, wrinkles, firming and lifting for face, neck and eyes",
      "Acne scars, enlarged pores and stretch marks",
      "Burst mode heats several depths in a single pass",
      "Single-use probes for hygiene and peace of mind",
    ],
    image: { src: "/images/products/emrf-m8.webp", alt: "EMRF M8 machine with six treatment probes", width: 652, height: 820 },
  },
  {
    slug: "fusion-cold-plasma-machine",
    eyebrow: "Skin renewal",
    name: "Fusion Cold Plasma Machine",
    lead: "Cold and hot plasma handpieces with eight interchangeable probes, for acne, inflammation, pigmentation and an all-round glow.",
    stats: [
      ["8", "Probe types"],
      ["30–70°C", "Cold plasma"],
      ["10–200W", "Power"],
      ['15"', "Touch screen"],
    ],
    points: [
      "Antibacterial, anti-inflammatory care for acne-prone skin",
      "Hot plasma for blemishes, pigmentation and freckles",
      "Rejuvenation, pore refinement, plumping and glow",
      "Scalp probes for hair-growth treatments",
    ],
    image: { src: "/images/products/fusion-cold-plasma.webp", alt: "Fusion cold plasma machine", width: 563, height: 546 },
    detail: {
      src: "/images/home/plasma-probes.webp",
      alt: "The interchangeable cold plasma probes",
      width: 501,
      height: 425,
      caption: "Eight interchangeable probes",
    },
  },
];

export function NewArrivals() {
  return (
    <section aria-labelledby="new-arrivals" className="bg-[linear-gradient(180deg,var(--color-surface)_0%,#fff_100%)] px-6 py-24 md:px-10 md:py-32 xl:px-[60px]">
      <div className="mx-auto max-w-[1640px]">
        <SectionHeader
          id="new-arrivals"
          label="Just Arrived"
          title={
            <>
              Meet Our Newest <span className="italic text-accent">Systems</span>
            </>
          }
          subtitle="Three new platforms for clinics ready to offer more, each with full training and support."
          className="mb-16 md:mb-20"
        />

        <div className="space-y-20 md:space-y-28">
          {spotlights.map((item, i) => (
            <Reveal key={item.slug} variant="none">
              <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
                <div className={i % 2 === 1 ? "lg:order-last" : ""}>
                  <Reveal variant="scale" className="group relative mx-auto aspect-square w-full max-w-[560px]">
                    <ProductStage
                      src={item.image.src}
                      alt={item.image.alt}
                      sizes="(min-width: 1024px) 560px, 100vw"
                      disc="lg"
                      imageClassName="settle"
                      className="size-full"
                    >
                      <span className="absolute left-[6%] top-[6%] flex size-16 flex-col items-center justify-center rounded-full bg-navy text-white shadow-navy md:size-20">
                        <span className="font-display text-[18px] font-bold italic leading-none md:text-[22px]">New</span>
                        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-rose-light">Arrival</span>
                      </span>
                    </ProductStage>
                  </Reveal>
                  {item.detail && (
                    <figure className="rise-late mx-auto mt-4 flex max-w-[560px] items-center gap-4 rounded-full bg-white p-2 pr-6 shadow-card ring-1 ring-line">
                      <Image
                        src={item.detail.src}
                        alt={item.detail.alt}
                        width={item.detail.width}
                        height={item.detail.height}
                        sizes="240px"
                        className="h-16 w-auto max-w-[55%] rounded-full bg-mist object-contain px-3 mix-blend-multiply md:h-20"
                      />
                      <figcaption className="text-[13px] font-semibold text-ink">{item.detail.caption}</figcaption>
                    </figure>
                  )}
                </div>

                <div>
                  <p className="pop eyebrow mb-4">{item.eyebrow}</p>
                  <h3 className="mb-5 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.01em] text-ink md:text-[44px]">
                    <SplitWords>{item.name}</SplitWords>
                  </h3>
                  <p className="rise-late mb-8 text-base leading-[1.8] text-muted md:text-[17px]">{item.lead}</p>

                  <dl className="stagger mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] bg-line ring-1 ring-line sm:grid-cols-4">
                    {item.stats.map(([value, label], n) => (
                      <div
                        key={label}
                        style={{ "--i": n + 3 } as React.CSSProperties}
                        className="flex flex-col-reverse bg-white px-4 py-4"
                      >
                        <dt className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</dt>
                        <dd className="font-display text-[22px] font-bold text-navy md:text-[26px]">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="stagger mb-10 space-y-3">
                    {item.points.map((point, n) => (
                      <li
                        key={point}
                        style={{ "--i": n + 6 } as React.CSSProperties}
                        className="flex items-start gap-3 text-[15px] leading-relaxed text-muted"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gradient-m text-white">
                          <CheckIcon size={11} />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="rise-late flex flex-col gap-3 sm:flex-row">
                    <Link href={`/contact?product=${item.slug}#inquiry`} className="btn btn-primary group">
                      Ask for a Quote
                      <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link href={`/products/${item.slug}`} className="btn btn-secondary">
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
