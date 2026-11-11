import { Fragment, useRef } from "react";
import { gsap, MOTION, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  as?: "h1" | "h2" | "h3";
  id?: string;
  /** Texto do site.ts. `\n` vira quebra de linha. */
  text: string;
  /** `load`: anima ao montar. `scroll`: anima ao entrar na viewport. */
  trigger?: "load" | "scroll";
  delay?: number;
  className?: string;
  /**
   * Classe aplicada a cada linha depois do split. Use para efeitos que dependem
   * da caixa do texto, como `.text-silver` (o gradiente precisa estar na linha).
   */
  lineClassName?: string;
};

function renderText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </Fragment>
  ));
}

/**
 * Título com linhas que sobem de dentro de uma máscara (SplitText). SPEC §7.1 e §8.
 * Não começa com opacity 0: o texto existe e é legível sem JS, com reduced-motion e pausado.
 */
export function SplitHeading({
  as: Tag = "h2",
  id,
  text,
  trigger = "scroll",
  delay = 0,
  className,
  lineClassName,
}: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { allowed } = useMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !allowed) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // efeitos de `lineClassName` (ex.: gradiente com background-clip) saem do título
        // enquanto ele está dividido, senão o pai desenha uma cópia fantasma do texto
        const moved = (lineClassName?.split(/\s+/) ?? []).filter((c) => c && el.classList.contains(c));
        el.classList.remove(...moved);
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: lineClassName,
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              ...MOTION.title,
              delay,
              ...(trigger === "scroll" && {
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
              }),
            }),
        });
        return () => {
          split.revert();
          el.classList.add(...moved);
        };
      });
    },
    { scope: ref, dependencies: [allowed, text, trigger, delay, lineClassName], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} id={id} className={cn("font-display", className)}>
      {renderText(text)}
    </Tag>
  );
}
