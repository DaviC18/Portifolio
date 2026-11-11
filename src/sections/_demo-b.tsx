/**
 * Demo do WP-B (`?demo=b`, só em dev; removido na Fase 3).
 */
import { MotionToggle } from "@/components/common/MotionToggle";
import { Toaster } from "@/components/ui/sonner";
import { useAnchorScroll, useLenis } from "@/lib/lenis";
import { Classification } from "@/sections/Classification";
import { Telemetry } from "@/sections/Telemetry";

export default function DemoB() {
  useLenis();
  useAnchorScroll();
  return (
    <>
      <main id="conteudo">
        <Classification />
        <Telemetry />
      </main>
      <div className="fixed bottom-3 left-3 z-50">
        <MotionToggle className="bg-carbon-950" />
      </div>
      <Toaster />
    </>
  );
}
