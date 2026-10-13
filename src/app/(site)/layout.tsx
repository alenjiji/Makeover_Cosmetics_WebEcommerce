import { BackToTop } from "@/components/layout/BackToTop";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { PointerGlow } from "@/components/ui/PointerGlow";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-md bg-white px-4 py-2 font-semibold text-navy shadow-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <PointerGlow />
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
