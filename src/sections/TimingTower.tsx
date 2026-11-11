import { useRef, useState } from "react";
import { Menu } from "lucide-react";
import { PitButton } from "@/components/common/PitButton";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { nav, profile, ui } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type NavId = (typeof nav)[number]["id"];

/**
 * Header estilo torre de cronometragem (SPEC §5).
 * Link ativo segue a seção visível; some ao rolar para baixo e volta ao rolar para cima
 * (sempre visível com foco dentro). No mobile, menu em `Sheet`.
 */
export function TimingTower() {
  const ref = useRef<HTMLElement>(null);
  const { allowed } = useMotion();
  const [active, setActive] = useState<NavId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // link ativo e fundo: valem com e sem movimento
  useGSAP(
    () => {
      nav.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActive(id);
          },
        });
      });
      ScrollTrigger.create({
        start: 24,
        end: () => ScrollTrigger.maxScroll(window),
        onToggle: (self) => setScrolled(self.isActive),
      });
    },
    { scope: ref },
  );

  // esconde/mostra no scroll: só com movimento permitido
  useGSAP(
    () => {
      const header = ref.current;
      if (!header || !allowed) return;
      const show = () => gsap.to(header, { yPercent: 0, duration: 0.3, ease: "power2.out", overwrite: true });
      const hide = () => {
        if (header.matches(":focus-within")) return;
        gsap.to(header, { yPercent: -100, duration: 0.3, ease: "power2.out", overwrite: true });
      };
      ScrollTrigger.create({
        start: 120,
        end: () => ScrollTrigger.maxScroll(window),
        onUpdate: (self) => (self.direction === 1 ? hide() : show()),
        onLeaveBack: show,
      });
      header.addEventListener("focusin", show);
      return () => header.removeEventListener("focusin", show);
    },
    { scope: ref, dependencies: [allowed], revertOnUpdate: true },
  );

  const links = (onNavigate?: () => void, vertical = false) =>
    nav.map((item) => {
      const isActive = active === item.id;
      return (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={onNavigate}
            aria-current={isActive ? "location" : undefined}
            className={cn(
              "group relative inline-flex min-h-11 items-center gap-2 font-sans font-semibold transition-colors duration-200",
              vertical ? "w-full border-b border-line py-3 text-2xl" : "px-3 text-sm",
              isActive ? "text-white" : "text-silver-300 hover:text-white",
            )}
          >
            <span className="font-mono text-xs text-silver-500 tabular-nums">{item.position}</span>
            {item.label}
            {!vertical && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute right-3 bottom-1.5 left-3 h-0.5 origin-left bg-teal-400 transition-transform duration-200",
                  isActive ? "scale-x-100" : "scale-x-0",
                )}
              />
            )}
          </a>
        </li>
      );
    });

  return (
    <header
      ref={ref}
      data-site-header=""
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-line bg-carbon-950/90 supports-backdrop-filter:backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="container-site flex min-h-16 items-center justify-between gap-4">
        <a href="#grid" className="inline-flex min-h-11 items-center gap-2" aria-label={profile.name}>
          <span className="font-condensed text-2xl leading-none font-bold text-white">{profile.initials}</span>
          <span className="font-mono text-xs text-silver-500">#{profile.number}</span>
        </a>

        <nav className="hidden lg:block">
          <ul className="flex items-center">{links()}</ul>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 font-mono text-xs tracking-[0.15em] text-silver-300 uppercase sm:inline-flex">
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-teal-400 opacity-60 motion-reduce:hidden in-data-[motion=off]:hidden" />
              <span className="relative size-2 rounded-full bg-teal-400" />
            </span>
            {ui.live}
          </span>
          <PitButton origem="header" variant="small-ghost" className="hidden lg:inline-flex" />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label={ui.openMenu}
              className="inline-flex size-11 items-center justify-center rounded-panel border border-line text-white lg:hidden"
            >
              <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm border-line bg-carbon-950 px-6 pt-20">
              <SheetTitle className="font-mono text-xs tracking-[0.2em] text-silver-500 uppercase">
                {profile.initials} #{profile.number}
              </SheetTitle>
              <nav>
                <ul className="flex flex-col">{links(() => setOpen(false), true)}</ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
