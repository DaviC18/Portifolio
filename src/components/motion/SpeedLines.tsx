import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Linhas fixas (posição e largura em %), para não mudar a cada render. */
const LINES = [
  { top: 14, width: 34, opacity: 0.14 },
  { top: 23, width: 18, opacity: 0.08 },
  { top: 31, width: 42, opacity: 0.12 },
  { top: 44, width: 24, opacity: 0.1 },
  { top: 52, width: 38, opacity: 0.16 },
  { top: 63, width: 16, opacity: 0.08 },
  { top: 72, width: 30, opacity: 0.12 },
  { top: 84, width: 22, opacity: 0.1 },
] as const;

type Props = {
  /** `hero`: deriva lenta em loop (só ≥1024px). `intro`: uma passada rápida quando `active` vira true. */
  variant: "intro" | "hero";
  /** só no `intro`: dispara a passada */
  active?: boolean;
  className?: string;
};

/**
 * Linhas horizontais finas que cruzam a área (SPEC §7.4). Decorativas (`aria-hidden`).
 * Com movimento reduzido ou pausado, não renderizam.
 */
export function SpeedLines({ variant, active = false, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { allowed } = useMotion();

  useGSAP(
    () => {
      if (!allowed) return;
      const lines = gsap.utils.toArray<HTMLElement>("[data-speed-line]");
      // xPercent que leva a linha da borda esquerda até sair pela direita
      const travel = (i: number) => 100 / ((LINES[i]?.width ?? 30) / 100);
      const mm = gsap.matchMedia();

      if (variant === "hero") {
        mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
          lines.forEach((line, i) => {
            gsap.fromTo(
              line,
              { xPercent: -100 },
              {
                xPercent: travel(i),
                duration: gsap.utils.random(3, 6),
                ease: "none",
                repeat: -1,
                delay: gsap.utils.random(0, 3),
              },
            );
          });
        });
        return;
      }

      mm.add(MQ.motion, () => {
        gsap.set(lines, { xPercent: -100, scaleX: 0.4 });
        if (!active) return;
        gsap.to(lines, {
          xPercent: (i: number) => travel(i),
          scaleX: 1,
          duration: 0.35,
          ease: "power2.in",
          stagger: { each: 0.02, from: "random" },
        });
      });
    },
    { scope: ref, dependencies: [allowed, variant, active], revertOnUpdate: true },
  );

  if (!allowed) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        variant === "hero" && "hidden lg:block",
        className,
      )}
    >
      {LINES.map((l, i) => (
        <span
          key={i}
          data-speed-line=""
          className="absolute left-0 h-px origin-left bg-silver-300"
          style={{ top: `${l.top}%`, width: `${l.width}%`, opacity: l.opacity }}
        />
      ))}
    </div>
  );
}
