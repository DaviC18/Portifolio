import { useRef, type ReactNode } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { contact, isTodo, ui, whatsappLink } from "@/content/site";
import { gsap, MOTION, MQ, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

type Props = {
  /** de onde veio o clique (evento `cta_whatsapp`) */
  origem: string;
  /** padrão: `ui.callBox` */
  children?: ReactNode;
  /** padrão: `contact.whatsappMessage` */
  message?: string;
  variant?: "primary" | "ghost" | "small" | "small-ghost";
  className?: string;
};

const VARIANTS = {
  primary: "min-h-14 px-7 text-base bg-teal-400 text-carbon-950",
  ghost: "min-h-14 px-7 text-base border border-line text-white",
  small: "min-h-11 px-4 text-sm bg-teal-400 text-carbon-950",
  /** header: não disputa o teal com o CTA do hero (SPEC §4, um CTA teal por viewport) */
  "small-ghost": "min-h-11 px-4 text-sm border border-line text-white",
} as const;

/** cor da aba interna que desliza no hover ("DRS") */
const TAB = {
  primary: "bg-teal-600",
  ghost: "bg-graphite-700",
  small: "bg-teal-600",
  "small-ghost": "bg-graphite-700",
} as const;

/**
 * CTA do WhatsApp (SPEC §8). Efeito "DRS": no hover/foco, uma aba interna desliza
 * (`xPercent`) e a seta avança. Sem movimento, é um link normal com troca de cor.
 * Com `contact.whatsapp` pendente, não aparece no build (em dev aparece tracejado).
 */
export function PitButton({ origem, children = ui.callBox, message, variant = "primary", className }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { allowed } = useMotion();
  const pending = isTodo(contact.whatsapp);
  const rendered = !pending || import.meta.env.DEV;

  const { contextSafe } = useGSAP(
    () => {
      // botão pendente no build não renderiza: nada para preparar
      if (!rendered) return;
      // a aba começa fora do botão; sem JS ela cobre o fundo e o botão continua legível
      gsap.set("[data-drs-tab]", { xPercent: -101 });
    },
    { scope: rendered ? ref : undefined, dependencies: [allowed], revertOnUpdate: true },
  );

  const open = contextSafe(() => {
    if (!allowed || !window.matchMedia(MQ.motion).matches) return;
    gsap.to("[data-drs-tab]", { xPercent: 0, ...MOTION.micro, overwrite: true });
    gsap.to("[data-drs-arrow]", { x: 4, ...MOTION.micro, overwrite: true });
  });
  const close = contextSafe(() => {
    if (!allowed) return;
    gsap.to("[data-drs-tab]", { xPercent: -101, ...MOTION.micro, overwrite: true });
    gsap.to("[data-drs-arrow]", { x: 0, ...MOTION.micro, overwrite: true });
  });

  if (!rendered) return null;

  return (
    <a
      ref={ref}
      href={pending ? "#" : whatsappLink(message)}
      target={pending ? undefined : "_blank"}
      rel="noopener"
      onClick={(e) => {
        if (pending) e.preventDefault();
        track("cta_whatsapp", { origem });
      }}
      onPointerEnter={open}
      onPointerLeave={close}
      onFocus={open}
      onBlur={close}
      title={pending ? "TODO_DAVI: contact.whatsapp" : undefined}
      className={cn(
        "relative isolate inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-panel font-semibold",
        VARIANTS[variant],
        // sem movimento, a aba não desliza: o hover vira troca de cor
        variant === "ghost" || variant === "small-ghost"
          ? "hover:border-silver-500 in-data-[motion=off]:hover:bg-graphite-700 motion-reduce:hover:bg-graphite-700"
          : "in-data-[motion=off]:hover:bg-teal-600 motion-reduce:hover:bg-teal-600",
        pending && "outline-2 outline-offset-2 outline-amber outline-dashed",
        className,
      )}
    >
      <span
        data-drs-tab=""
        aria-hidden="true"
        className={cn("absolute inset-0 -z-10", TAB[variant])}
      />
      <MessageCircle aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.75} />
      <span>{children}</span>
      <ArrowRight data-drs-arrow="" aria-hidden="true" className="size-4 shrink-0" strokeWidth={2} />
      <span className="sr-only"> {ui.newTab}</span>
    </a>
  );
}
