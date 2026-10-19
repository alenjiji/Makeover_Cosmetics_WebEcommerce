import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/CheckoutView";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Place your order for medical aesthetic and dental equipment.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        badge="Checkout"
        title={
          <>
            Place Your <span className="italic text-accent">Order</span>
          </>
        }
        subtitle="Tell us where to deliver. Our team confirms the final price, payment and delivery within 24 hours."
      />
      <section aria-label="Checkout" className="bg-surface px-4 py-14 sm:px-6 md:px-10 md:py-20 xl:px-[60px]">
        <CheckoutView />
      </section>
    </>
  );
}
