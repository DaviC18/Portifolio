import { useRef, useState } from "react";
import { CopyEmailButton } from "@/components/common/CopyEmailButton";
import { PitButton } from "@/components/common/PitButton";
import { contact, isTodo } from "@/content/site";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";

/** no dock o ícone secundário (seta / copiar) sai para os dois botões caberem em 360px */
const DOCK_BTN = "rounded-full px-3.5 whitespace-nowrap [&_svg:last-of-type]:hidden";

/**
 * Barra flutuante de contato (<1024px, SPEC §5): WhatsApp + copiar e-mail.
 * Aparece depois que o hero (`#grid`) sai da tela e some dentro de `#box`.
 * Respeita a safe-area. Sem movimento: aparece/some sem animar.
 */
export function ContactDock() {
  const ref = useRef<HTMLDivElement>(null);
  const { allowed } = useMotion();
  const [afterHero, setAfterHero] = useState(false);
  const [inBox, setInBox] = useState(false);
  const visible = afterHero && !inBox;

  useGSAP(() => {
    const hero = document.getElementById("grid");
    const box = document.getElementById("box");
    if (hero) {
      ScrollTrigger.create({
        trigger: hero,
        start: "bottom top",
        end: () => ScrollTrigger.maxScroll(window),
        onToggle: (self) => setAfterHero(self.isActive),
      });
    } else {
      setAfterHero(true);
    }
    if (box) {
      ScrollTrigger.create({
        trigger: box,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => setInBox(self.isActive),
      });
    }
  });

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const animate = allowed && window.matchMedia(MQ.motion).matches;
      const to = visible ? { autoAlpha: 1, scale: 1, y: 0 } : { autoAlpha: 0, scale: 0.9, y: 16 };
      if (animate) gsap.to(el, { ...to, duration: 0.35, ease: visible ? "back.out(1.6)" : "power2.in", overwrite: true });
      else gsap.set(el, to);
    },
    { scope: ref, dependencies: [visible, allowed] },
  );

  const hidden = isTodo(contact.whatsapp) && isTodo(contact.email) && !import.meta.env.DEV;
  if (hidden) return null;

  return (
    <div
      ref={ref}
      inert={!visible}
      className="invisible fixed inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-4 opacity-0 lg:hidden"
    >
      <div className="flex items-center gap-2 rounded-full border border-line bg-carbon-950/90 p-1.5 shadow-lg shadow-black/40 supports-backdrop-filter:backdrop-blur-md">
        <PitButton origem="dock" variant="small" className={DOCK_BTN} />
        <CopyEmailButton origem="dock" variant="small" className={DOCK_BTN} />
      </div>
    </div>
  );
}
