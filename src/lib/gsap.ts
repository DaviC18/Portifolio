/**
 * Ponto único de registro do GSAP (SPEC §7.6). Sempre importar daqui, nunca de "gsap" direto.
 *
 * Bundle (SPEC §11, < 200KB gz): aqui só entram os plugins da página inicial.
 * DrawSVG e MotionPath ficam em `gsap-track.ts`, importado só pelo TrackMap (lazy).
 * Flip e CustomEase não são usados por nenhum componente; registrar quando forem.
 */
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin);

/** Reveal de conteúdo é o caso mais comum (SPEC §7.1). */
gsap.defaults({ duration: 0.8, ease: "expo.out" });

/** Media queries padrão para `gsap.matchMedia()`. */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023.98px)",
  wide: "(min-width: 1280px)",
  finePointer: "(pointer: fine)",
} as const;

/** Durações e eases da SPEC §7.1, para não espalhar números mágicos. */
export const MOTION = {
  micro: { duration: 0.2, ease: "power2.out" },
  reveal: { duration: 0.8, ease: "expo.out" },
  title: { duration: 0.9, ease: "expo.out", stagger: 0.08 },
  overlay: { duration: 0.8, ease: "power4.inOut" },
  listStagger: 0.06,
} as const;

/**
 * Leva tudo que está rodando ao estado final (SPEC §7.5).
 * Loops infinitos não têm fim: voltam ao início e param.
 */
export function finishAllAnimations() {
  gsap.globalTimeline.getChildren(false, true, true).forEach((anim) => {
    if (anim.repeat() === -1) anim.progress(0).pause();
    else anim.progress(1);
  });
}

export { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP };
