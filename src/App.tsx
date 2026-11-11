import { lazy, Suspense, useEffect, useState, useSyncExternalStore } from "react";
import { ContactDock } from "@/components/common/ContactDock";
import { SkipLink } from "@/components/common/SkipLink";
import { Toaster } from "@/components/ui/sonner";
import { MQ, ScrollTrigger } from "@/lib/gsap";
import { shouldRunIntro } from "@/lib/intro";
import { useAnchorScroll, useLenis } from "@/lib/lenis";
import { useMotion } from "@/lib/motion";
import { CarSetup } from "@/sections/CarSetup";
import { Classification } from "@/sections/Classification";
import { Contact } from "@/sections/Contact";
import { DriverCard } from "@/sections/DriverCard";
import { Footer } from "@/sections/Footer";
import { Hero } from "@/sections/Hero";
import { TeamRadio } from "@/sections/TeamRadio";
import { Telemetry } from "@/sections/Telemetry";
import { TimingTower } from "@/sections/TimingTower";

// decorativos e pesados: fora do bundle inicial (SPEC §11)
const StartLights = lazy(() =>
  import("@/components/motion/StartLights").then((m) => ({ default: m.StartLights })),
);
const TrackMap = lazy(() => import("@/components/motion/TrackMap").then((m) => ({ default: m.TrackMap })));

/** `true` em telas ≥1280px: só aí vale baixar o TrackMap. */
function useWide() {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(MQ.wide);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(MQ.wide).matches,
    () => false,
  );
}

/** Página única na ordem da SPEC §5. */
export default function App() {
  const { allowed } = useMotion();
  const wide = useWide();
  // decidido na montagem: sem intro, o hero entra direto
  const [introRuns] = useState(() => shouldRunIntro(allowed));
  const [heroReady, setHeroReady] = useState(!introRuns);

  useLenis();
  useAnchorScroll();

  // posições dos ScrollTriggers depois que fontes e imagens mudam o layout (SPEC §7.6)
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <SkipLink />
      {introRuns && (
        // enquanto o chunk da intro carrega, um véu carbon evita o hero piscar antes das luzes
        <Suspense fallback={<div aria-hidden="true" className="fixed inset-0 z-[200] bg-carbon-950" />}>
          <StartLights onComplete={() => setHeroReady(true)} />
        </Suspense>
      )}
      <TimingTower />
      <main id="conteudo">
        <Hero ready={heroReady} />
        <TeamRadio />
        <Classification />
        <Telemetry />
        <CarSetup />
        <DriverCard />
        <Contact />
      </main>
      <Footer />
      {wide && allowed && (
        <Suspense fallback={null}>
          <TrackMap />
        </Suspense>
      )}
      <ContactDock />
      <Toaster />
    </>
  );
}
