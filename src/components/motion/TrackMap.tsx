import { useRef } from "react";
import { trackMap } from "@/content/site";
import { gsap, MotionPathPlugin, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";

/**
 * Traçado FICTÍCIO desenhado do zero (SPEC §1.1 e §7.4): uma reta longa à esquerda,
 * curva no topo, um "S" no meio e o retorno. Não reproduz nenhum circuito real.
 */
const TRACK =
  "M30 182 L30 62 C30 32 48 16 70 20 C94 25 102 46 86 60 C70 74 96 88 93 108 C90 128 70 134 74 154 C78 176 66 192 46 192 C36 192 30 188 30 182 Z";

/** progresso do scroll da página (0–1) em que o topo da seção encosta no topo da tela */
function sectionProgress(id: string) {
  const el = document.getElementById(id);
  const max = ScrollTrigger.maxScroll(window);
  if (!el || max <= 0) return null;
  const top = el.getBoundingClientRect().top + window.scrollY;
  return gsap.utils.clamp(0, 1, top / max);
}

/**
 * Mini mapa de pista fixo à direita (≥1280px), ligado ao scroll da página inteira:
 * a parte percorrida fica teal (DrawSVG) e um ponto segue o traçado (MotionPath).
 * Marcadores S1/S2/S3 nos pontos das seções de `trackMap.sectors`, recalculados no refresh.
 * Decorativo (`aria-hidden`). Com movimento reduzido ou pausado, não renderiza.
 */
export function TrackMap() {
  const ref = useRef<HTMLDivElement>(null);
  const { allowed } = useMotion();

  useGSAP(
    () => {
      if (!allowed) return;
      const mm = gsap.matchMedia();

      mm.add(`${MQ.wide} and ${MQ.motion}`, () => {
        const path = ref.current?.querySelector<SVGPathElement>("[data-track-base]");
        if (!path) return;
        const raw = MotionPathPlugin.cacheRawPathMeasurements(MotionPathPlugin.getRawPath(path));

        const placeSectors = () => {
          gsap.utils.toArray<SVGGElement>("[data-sector]").forEach((g) => {
            const p = sectionProgress(g.dataset.sector ?? "");
            if (p === null) {
              gsap.set(g, { autoAlpha: 0 });
              return;
            }
            const pt = MotionPathPlugin.getPositionOnPath(raw, p);
            gsap.set(g, { x: pt.x, y: pt.y, autoAlpha: 1 });
          });
        };

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              onRefresh: placeSectors,
            },
          })
          .fromTo("[data-track-progress]", { drawSVG: "0% 0%" }, { drawSVG: "0% 100%" }, 0)
          .to(
            "[data-track-car]",
            // immediateRender: o carro já nasce na largada, antes do primeiro scroll
            { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, immediateRender: true },
            0,
          );

        placeSectors();
      });
    },
    { scope: ref, dependencies: [allowed], revertOnUpdate: true },
  );

  if (!allowed) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-1/2 right-6 z-30 hidden -translate-y-1/2 xl:block"
    >
      <svg viewBox="0 0 120 200" width="120" height="200" fill="none" overflow="visible">
        <path data-track-base="" d={TRACK} stroke="var(--color-line)" strokeWidth="2" />
        <path
          data-track-progress=""
          d={TRACK}
          stroke="var(--color-teal-400)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* linha de largada */}
        <path d="M24 170 H36" stroke="var(--color-silver-500)" strokeWidth="1" />
        {trackMap.sectors.map((s) => (
          <g key={s.label} data-sector={s.target} opacity="0">
            <circle r="2.5" fill="var(--color-carbon-950)" stroke="var(--color-silver-500)" />
            <text
              x="-7"
              y="3"
              textAnchor="end"
              fill="var(--color-silver-500)"
              fontSize="8"
              fontFamily="var(--font-mono)"
            >
              {s.label}
            </text>
          </g>
        ))}
        <circle data-track-car="" r="4" fill="var(--color-teal-400)" />
      </svg>
    </div>
  );
}
