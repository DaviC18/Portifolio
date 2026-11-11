/**
 * Demo do WP-C (`?demo=c`, só em dev; removido na Fase 3).
 * O `#grid` falso só existe para testar o ContactDock.
 */
import { ContactDock } from "@/components/common/ContactDock";
import { Toaster } from "@/components/ui/sonner";
import { useAnchorScroll, useLenis } from "@/lib/lenis";
import { CarSetup } from "@/sections/CarSetup";
import { Contact } from "@/sections/Contact";
import { DriverCard } from "@/sections/DriverCard";
import { Footer } from "@/sections/Footer";

export default function DemoC() {
  useLenis();
  useAnchorScroll();
  return (
    <>
      <main id="conteudo">
        <section id="grid" className="flex min-h-[60vh] items-center bg-carbon-900">
          <p className="container-site font-mono text-xs text-silver-500">#grid (falso)</p>
        </section>
        <CarSetup />
        <DriverCard />
        <Contact />
      </main>
      <Footer />
      <ContactDock />
      <Toaster />
    </>
  );
}
