import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { hero, profile, ui } from "@/content/site";

/** Checagem visual da Fase 0 (fontes, .text-silver, botão teal). Sai quando o WP-3 montar as seções. */
function FoundationCheck() {
  return (
    <section className="relative isolate min-h-svh py-24">
      <div className="carbon" aria-hidden="true" />
      <div className="container-site space-y-8">
        <p className="font-mono text-xs tracking-[0.2em] text-silver-500 uppercase tabular-nums">{hero.eyebrow}</p>
        <h1 className="font-condensed text-silver text-[clamp(3rem,10vw,8.5rem)] leading-[0.9] font-bold uppercase">
          {profile.name}
        </h1>
        <p className="max-w-[65ch] font-sans text-lg leading-relaxed">{profile.pitch}</p>
        <Button>{ui.callBox}</Button>
      </div>
    </section>
  );
}

/**
 * Esqueleto da página (SPEC §5). A partir da Fase 1 este arquivo é do integrador (WP-3).
 * Nenhum WP da Fase 2 edita aqui: cada um testa no próprio `_demo-<wp>.tsx`.
 */
export default function App() {
  return (
    <>
      {/* SkipLink */}
      {/* StartLights (lazy, overlay da intro) */}
      {/* TimingTower (header) */}
      <main id="conteudo">
        <FoundationCheck />
        {/* 1 · Hero (#grid) */}
        {/* 2 · TeamRadio (#radio) */}
        {/* 3 · Classification (#classificacao) */}
        {/* 4 · Telemetry (#telemetria) */}
        {/* 5 · CarSetup (#setup) */}
        {/* 6 · DriverCard (#piloto) */}
        {/* 7 · Contact (#box) */}
      </main>
      {/* Footer */}
      {/* TrackMap (lazy, ≥1280px) */}
      {/* ContactDock (<1024px) */}
      <Toaster />
    </>
  );
}
