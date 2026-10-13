import { site } from "@/lib/site";

const items = [
  site.markets.join(" · "),
  "ISO Certified",
  "CE Approved",
  "24/7 Technical Support",
  "Free Consultation",
  "Training Included",
  `${site.claims.models} Models`,
  `${site.claims.countries} Countries`,
  "Worldwide Shipping",
  `Trusted Since ${site.claims.since}`,
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center whitespace-nowrap px-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/85 md:px-8">
          <span aria-hidden="true" className="mr-6 size-1.5 rotate-45 bg-rose md:mr-8" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** A slowly scrolling band of trust points under the hero. Pauses on hover. */
export function TrustMarquee() {
  return (
    <section aria-label={`Why clinics choose ${site.name}`} className="marquee overflow-hidden bg-navy-deep py-5">
      <div className="marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
