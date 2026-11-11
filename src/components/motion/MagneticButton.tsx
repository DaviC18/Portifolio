import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /** fração da distância ao centro que o botão acompanha */
  strength?: number;
  className?: string;
};

/**
 * Envolve um CTA e o puxa levemente em direção ao cursor (`gsap.quickTo`). SPEC §8.
 * Só com `pointer: fine` e movimento permitido; fora disso é um wrapper inerte.
 */
export function MagneticButton({ children, strength = 0.25, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const { allowed } = useMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !allowed) return;
      const mm = gsap.matchMedia();

      mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref, dependencies: [allowed, strength], revertOnUpdate: true },
  );

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {children}
    </span>
  );
}
