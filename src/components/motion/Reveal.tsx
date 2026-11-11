import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION, MQ, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** atraso em segundos */
  delay?: number;
  /** se definido, anima cada filho direto em sequência, com esse intervalo */
  stagger?: number;
  /** deslocamento inicial em px */
  y?: number;
};

/**
 * Fade + subida ao entrar na viewport (uma vez). SPEC §8.
 * Sem JS, com reduced-motion ou pausado, o conteúdo fica visível (`[data-reveal]` no CSS).
 */
export function Reveal({ children, as: Tag = "div", className, delay = 0, stagger, y = 24 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { allowed } = useMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !allowed) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const targets = stagger ? Array.from(el.children) : el;
        if (stagger) gsap.set(el, { opacity: 1 });
        gsap.fromTo(
          targets,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            ...MOTION.reveal,
            delay,
            stagger,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      });
    },
    { scope: ref, dependencies: [allowed, delay, stagger, y], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} data-reveal="" className={className ? cn(className) : undefined}>
      {children}
    </Tag>
  );
}
