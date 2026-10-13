import Link from "next/link";
import { ContactChooser } from "@/components/ui/ContactChooser";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";

type Props = {
  title?: string;
  text?: string;
  whatsappMessage?: string;
};

export function InquiryBand({
  title = "Need Help Choosing the Right Equipment?",
  text = "Our team of experts is ready to help you find the perfect solution for your business needs",
  whatsappMessage = `Hi ${site.name}, I'd like help choosing the right equipment for my clinic.`,
}: Props) {
  return (
    <section className="theme-dark relative overflow-hidden rounded-[28px] bg-navy px-6 py-14 text-center text-white md:px-12 md:py-16">
      <div aria-hidden="true" className="world-map absolute inset-x-[-10%] inset-y-0 bg-white/[.05]" />
      {/* The M's rose end, warming the corner. */}
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-24 size-[420px] rounded-full bg-[radial-gradient(circle,rgb(202_153_142/0.35),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="mb-4 font-display text-[28px] font-bold leading-tight tracking-[-0.01em] md:text-[38px]">
          {title}
        </h2>
        <p className="mb-9 text-base leading-[1.8] text-white/75 md:text-[17px]">{text}</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/contact" className="btn btn-light group">
            Request Full Catalog
            <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
          </Link>
          <ContactChooser channel="whatsapp" message={whatsappMessage} className="btn btn-outline-light">
            <WhatsAppIcon />
            Chat on WhatsApp
          </ContactChooser>
        </div>
        <p className="mt-7 text-sm text-white/75">
          Or{" "}
          <ContactChooser channel="call" className="font-semibold text-rose-light underline-offset-4 hover:underline">
            call us in the UAE or India
          </ContactChooser>
        </p>
      </div>
    </section>
  );
}
