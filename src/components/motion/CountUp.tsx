import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

const format = (n: number, decimals: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);

/**
 * Conta de 0 até `value` ao entrar na viewport, em formato pt-BR. SPEC §8.
 * O HTML já nasce com o valor final (sem JS, reduced-motion ou pausado mostra o número certo);
 * leitores de tela leem só o valor final.
 */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const { allowed } = useMotion();
  const finalText = `${prefix}${format(value, decimals)}${suffix}`;

  useGSAP(
    () => {
      // mexe no próprio nó de texto do React, para não descolar o DOM do que o React conhece
      const node = ref.current?.firstChild;
      if (!node || !allowed) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const state = { v: 0 };
        const render = () => {
          node.nodeValue = `${prefix}${format(state.v, decimals)}${suffix}`;
        };
        render();
        gsap.to(state, {
          v: value,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: render,
          scrollTrigger: { trigger: ref.current, start: "top bottom", once: true },
        });
        return () => {
          node.nodeValue = finalText;
        };
      });
    },
    { scope: ref, dependencies: [allowed, value, decimals, prefix, suffix], revertOnUpdate: true },
  );

  return (
    <span className={cn("font-mono tabular-nums", className)}>
      <span ref={ref} aria-hidden="true">
        {finalText}
      </span>
      <span className="sr-only">{finalText}</span>
    </span>
  );
}
