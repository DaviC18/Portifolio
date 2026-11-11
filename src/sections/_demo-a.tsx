/**
 * Demo do WP-A (`?demo=a`, só em dev; removido na Fase 3).
 * Rótulos daqui são só de teste.
 */
import { useState } from "react";
import { MotionToggle } from "@/components/common/MotionToggle";
import { StartLights } from "@/components/motion/StartLights";
import { Toaster } from "@/components/ui/sonner";
import { nav } from "@/content/site";
import { useAnchorScroll, useLenis } from "@/lib/lenis";
import { Hero } from "@/sections/Hero";
import { TeamRadio } from "@/sections/TeamRadio";
import { TimingTower } from "@/sections/TimingTower";

export default function DemoA() {
  const [ready, setReady] = useState(false);
  useLenis();
  useAnchorScroll();

  const resetIntro = () => {
    try {
      sessionStorage.removeItem("dc:intro-seen");
    } catch {
      // sem storage
    }
    location.reload();
  };

  return (
    <>
      <StartLights onComplete={() => setReady(true)} />
      <TimingTower />
      <main id="conteudo">
        <Hero ready={ready} />
        <TeamRadio />
        {nav
          .filter((n) => n.id !== "grid")
          .map((n, i) => (
            <section
              key={n.id}
              id={n.id}
              className={`flex min-h-screen items-center ${i % 2 ? "bg-carbon-950" : "bg-carbon-900"}`}
            >
              <p className="container-site font-condensed text-6xl font-bold uppercase">{n.label}</p>
            </section>
          ))}
      </main>
      <div className="fixed bottom-3 left-3 z-[300] flex gap-2">
        <MotionToggle className="bg-carbon-950" />
        <button
          type="button"
          onClick={resetIntro}
          className="min-h-11 rounded-panel border border-line bg-carbon-950 px-4 font-mono text-xs"
        >
          rever intro
        </button>
      </div>
      <Toaster />
    </>
  );
}
