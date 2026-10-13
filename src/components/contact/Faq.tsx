import type { Faq as FaqItem } from "@/data/faq";
import { ChevronDownIcon } from "@/components/ui/icons";

/** Native <details> disclosures: keyboard and screen-reader accessible with no JS. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <details
          key={item.question}
          name="faq"
          open={i === 0}
          className="group rounded-2xl border border-divider bg-white shadow-card transition-all duration-300 open:border-navy/25 open:shadow-card-hover"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 md:px-8 md:py-6 [&::-webkit-details-marker]:hidden">
            <h3 className="font-display text-[19px] font-bold leading-snug tracking-[-0.01em] text-ink md:text-[23px]">
              {item.question}
            </h3>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mist text-navy transition-all duration-300 group-open:rotate-180 group-open:bg-navy group-open:text-white">
              <ChevronDownIcon size={20} />
            </span>
          </summary>
          <p className="px-6 pb-6 text-[15px] leading-[1.7] text-muted md:px-8 md:pb-7 md:text-base">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
