import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPolicies } from "@/lib/commerce/shopify";

/** Shopify's policy handles. Pages exist for whichever ones are filled in under Settings → Policies. */
const handles = ["privacy-policy", "refund-policy", "shipping-policy", "terms-of-service"];

export function generateStaticParams() {
  return handles.map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: PageProps<"/policies/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const policy = (await getPolicies()).find((p) => p.handle === handle);
  return policy ? { title: policy.title, alternates: { canonical: `/policies/${handle}` } } : {};
}

export default function PolicyPage({ params }: PageProps<"/policies/[handle]">) {
  return (
    <Suspense>
      <Policy params={params} />
    </Suspense>
  );
}

async function Policy({ params }: Pick<PageProps<"/policies/[handle]">, "params">) {
  const { handle } = await params;
  const policy = (await getPolicies()).find((p) => p.handle === handle);
  if (!policy) notFound();

  return (
    <>
      <PageHeader badge="Store Policies" title={policy.title} subtitle="How we handle your orders, data and deliveries." />
      <section className="bg-surface px-4 py-14 sm:px-6 md:px-10 md:py-20 xl:px-[60px]">
        <article
          className="policy-body mx-auto max-w-3xl rounded-[28px] bg-white p-6 shadow-card ring-1 ring-line sm:p-10 md:p-14"
          // Written by the store owner in Shopify admin.
          dangerouslySetInnerHTML={{ __html: policy.body }}
        />
      </section>
    </>
  );
}
