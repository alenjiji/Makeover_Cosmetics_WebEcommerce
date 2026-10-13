import type { Metadata } from "next";
import { ClosingInvite } from "@/components/home/ClosingInvite";
import { Essentials } from "@/components/home/Essentials";
import { Facility } from "@/components/home/Facility";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { NewArrivals } from "@/components/home/NewArrivals";
import { Process } from "@/components/home/Process";
import { SeriesGrid } from "@/components/home/SeriesGrid";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { Welcome } from "@/components/home/Welcome";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: site.title },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: { url: "/", images: [{ url: "/images/home/hero-2in1.webp", alt: "2-in-1 diode and Nd:YAG laser" }] },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  slogan: site.tagline,
  url: site.url,
  logo: new URL("/brand/logo.png", site.url).toString(),
  email: site.email,
  contactPoint: site.lines.map((line) => ({
    "@type": "ContactPoint",
    telephone: `+${line.number}`,
    contactType: "sales",
    areaServed: line.id === "uae" ? "AE" : "IN",
  })),
  foundingDate: String(site.claims.since),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Office No.57, 4th Floor, UNIGROVE Business Center, Al Gaizi Plaza, Al Garhoud",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\u003c") }}
      />
      <Hero />
      <TrustMarquee />
      <Welcome />
      <NewArrivals />
      <SeriesGrid />
      <FeaturedProducts />
      <Essentials />
      <Process />
      <Facility />
      <ClosingInvite />
    </>
  );
}
