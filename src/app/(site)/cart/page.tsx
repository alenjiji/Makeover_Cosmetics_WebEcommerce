import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the equipment you've selected and place your order.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageHeader
        badge="Your Order"
        title={
          <>
            Your <span className="italic text-accent">Cart</span>
          </>
        }
        subtitle="Review your equipment, then place your order."
      />
      <section aria-label="Cart contents" className="bg-surface px-4 py-14 sm:px-6 md:px-10 md:py-20 xl:px-[60px]">
        <CartPageView />
      </section>
    </>
  );
}
