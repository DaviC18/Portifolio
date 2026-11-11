import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  /** maior valor do grupo (a barra cheia) */
  max: number;
  className?: string;
};

/**
 * Barra horizontal proporcional a `value / max`, que preenche com `scaleX` ao entrar. SPEC §6 e §8.
 * Decorativa: o número já aparece no CountUp ao lado. Sem movimento, nasce preenchida.
 */
export function TelemetryBar({ value, max, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const { allowed } = useMotion();
  const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;

  useGSAP(
    () => {
      const fill = fillRef.current;
      if (!fill || !allowed) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.from(fill, {
          scaleX: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        });
      });
    },
    { scope: ref, dependencies: [allowed, ratio], revertOnUpdate: true },
  );

  return (
    <span ref={ref} aria-hidden="true" className={cn("block h-1 w-full overflow-hidden bg-line", className)}>
      <span
        ref={fillRef}
        className="block h-full w-full origin-left bg-teal-400"
        style={{ transform: `scaleX(${ratio})` }}
      />
    </span>
  );
}
