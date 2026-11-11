import { useRef } from "react";
import { Radio } from "lucide-react";
import { teamRadio } from "@/content/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";

/** alturas de repouso das barras (escala 0–1), fixas para não mudar a cada render */
const BARS = [0.35, 0.7, 0.5, 0.9, 0.45, 0.75, 0.3] as const;

/**
 * Faixa "Rádio do box" `#radio` (SPEC §5): a seção "agora".
 * Ondas de áudio com `scaleY` em loop leve e a mensagem revelada com ScrambleText ao entrar.
 * Fora do menu. Sem movimento: barras paradas e mensagem já escrita.
 */
export function TeamRadio() {
  const ref = useRef<HTMLElement>(null);
  const { allowed } = useMotion();

  useGSAP(
    () => {
      if (!allowed) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-radio-bar]").forEach((bar, i) => {
          gsap.to(bar, {
            scaleY: () => gsap.utils.random(0.2, 1),
            duration: gsap.utils.random(0.35, 0.6),
            ease: "sine.inOut",
            repeat: -1,
            repeatRefresh: true,
            yoyo: true,
            delay: i * 0.05,
          });
        });

        gsap.to("[data-radio-message]", {
          duration: 1.4,
          scrambleText: {
            text: teamRadio.message,
            chars: "upperCase",
            revealDelay: 0.2,
            speed: 0.5,
          },
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref, dependencies: [allowed], revertOnUpdate: true },
  );

  return (
    <section
      ref={ref}
      id="radio"
      aria-labelledby="radio-title"
      className="border-y border-line bg-carbon-900 py-6 md:py-8"
    >
      <div className="container-site flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <div className="flex shrink-0 items-center gap-3">
          <Radio aria-hidden="true" className="size-5 text-teal-400" strokeWidth={1.75} />
          <h2 id="radio-title" className="font-mono text-xs tracking-[0.2em] text-silver-300 uppercase">
            {teamRadio.label}
          </h2>
          <span aria-hidden="true" className="ml-1 flex h-5 items-center gap-[3px]">
            {BARS.map((h, i) => (
              <span
                key={i}
                data-radio-bar=""
                className="block h-full w-[3px] origin-center rounded-full bg-teal-400"
                style={{ transform: `scaleY(${h})` }}
              />
            ))}
          </span>
        </div>
        <p className="font-mono text-sm leading-relaxed text-white md:text-base">
          <span data-radio-message="" aria-hidden="true">
            {teamRadio.message}
          </span>
          <span className="sr-only">{teamRadio.message}</span>
        </p>
      </div>
    </section>
  );
}
