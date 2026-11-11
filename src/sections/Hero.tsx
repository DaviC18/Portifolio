import { lazy, Suspense, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { PitButton } from "@/components/common/PitButton";
import { CarbonBg } from "@/components/motion/CarbonBg";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { hero, isTodo, profile, ui } from "@/content/site";
import { gsap, MOTION, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";

const SpeedLines = lazy(() =>
  import("@/components/motion/SpeedLines").then((m) => ({ default: m.SpeedLines })),
);

type Props = {
  /** true quando a intro terminou (ou não rodou): libera a timeline de entrada */
  ready: boolean;
};

/**
 * Hero `#grid` (SPEC §5 e §7.3). Único `<h1>` da página.
 * O h1 não nasce com opacity 0 no CSS (LCP): a entrada só esconde linhas dentro de máscaras.
 */
export function Hero({ ready }: Props) {
  const ref = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const readyRef = useRef(ready);
  const { allowed } = useMotion();

  // Monta a entrada pausada (já no estado inicial) para disparar quando `ready` virar true.
  useGSAP(
    () => {
      if (!allowed) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const h1 = ref.current?.querySelector<HTMLElement>("h1");
        if (!h1) return;
        // o gradiente vai para cada linha enquanto o h1 está dividido (ver SplitHeading)
        h1.classList.remove("text-silver");
        const split = SplitText.create(h1, { type: "lines", mask: "lines", linesClass: "text-silver" });

        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        tl.from("[data-hero='eyebrow']", { autoAlpha: 0, y: 12, duration: 0.5 })
          .from(split.lines, { yPercent: 110, duration: 0.9, stagger: MOTION.title.stagger }, 0.1)
          .from("[data-hero='copy']", { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.06 }, 0.35)
          .from("[data-hero='chip']", { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.05 }, 0.5)
          .from("[data-hero='cta']", { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.06 }, 0.6)
          .from("[data-hero='number']", { x: 60, duration: 1.2 }, 0.2)
          .from("[data-hero='cue']", { autoAlpha: 0, duration: 0.4 }, 1);
        tlRef.current = tl;
        // `ready` pode ter chegado antes da timeline existir
        if (readyRef.current) tl.play();

        return () => {
          if (tlRef.current === tl) tlRef.current = null;
          split.revert();
          h1.classList.add("text-silver");
        };
      });
    },
    { scope: ref, dependencies: [allowed], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      readyRef.current = ready;
      if (ready) tlRef.current?.play();
    },
    { dependencies: [ready] },
  );

  const chips = [
    !isTodo(profile.city) && { key: "city", label: profile.city, live: false },
    { key: "availability", label: profile.availability, live: true },
    profile.remote && { key: "remote", label: ui.remote, live: false },
  ].filter((c): c is { key: string; label: string; live: boolean } => Boolean(c));

  return (
    <section
      ref={ref}
      id="grid"
      aria-labelledby="grid-title"
      className="relative isolate flex min-h-svh items-center overflow-hidden bg-carbon-950 pt-24 pb-28"
    >
      <CarbonBg />
      {allowed && (
        <Suspense fallback={null}>
          <SpeedLines variant="hero" className="-z-10" />
        </Suspense>
      )}

      {/* "12" gigante em contorno, decorativo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-[-6vw] -z-10 -translate-y-1/2 opacity-40 select-none lg:right-[-2vw] lg:opacity-70"
      >
        <span
          data-hero="number"
          className="font-condensed block text-[clamp(16rem,48vw,46rem)] leading-none font-bold text-transparent [-webkit-text-stroke:1px_var(--color-silver-500)]"
        >
          {profile.number}
        </span>
      </span>

      <div className="container-site">
        <p
          data-hero="eyebrow"
          className="mb-6 font-mono text-xs tracking-[0.2em] text-silver-500 uppercase tabular-nums"
        >
          {hero.eyebrow}
        </p>

        <h1
          id="grid-title"
          className="font-condensed text-silver text-[clamp(3rem,10vw,8.5rem)] leading-[0.9] font-bold uppercase"
        >
          {profile.name}
        </h1>

        <p data-hero="copy" className="mt-6 font-display text-xl font-semibold text-silver-100 md:text-2xl">
          {profile.role}
        </p>
        <p data-hero="copy" className="mt-3 max-w-[60ch] text-base leading-relaxed text-silver-300 md:text-lg">
          {profile.pitch}
        </p>

        <ul className="mt-8 flex flex-wrap gap-2">
          {chips.map((c) => (
            <li
              key={c.key}
              data-hero="chip"
              className="inline-flex min-h-9 items-center gap-2 rounded-full border border-line bg-carbon-950/70 px-3.5 font-mono text-xs tracking-wide text-silver-300"
            >
              {c.live && (
                <span aria-hidden="true" className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-teal-400 opacity-60 motion-reduce:hidden in-data-[motion=off]:hidden" />
                  <span className="relative size-2 rounded-full bg-teal-400" />
                </span>
              )}
              {c.label}
            </li>
          ))}
        </ul>

        {/* celular: botões empilhados em largura total; ≥640px lado a lado */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          {/* sem link (WhatsApp pendente) o wrapper some, senão o gap do flex desloca o resto */}
          <div data-hero="cta" className="[&:not(:has(a))]:hidden">
            <MagneticButton className="w-full sm:w-auto">
              <PitButton origem="hero" className="w-full" />
            </MagneticButton>
          </div>
          <a
            data-hero="cta"
            href="#classificacao"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-panel border border-line bg-carbon-950/70 px-7 font-semibold text-white transition-colors duration-200 hover:border-silver-500 hover:bg-graphite-700"
          >
            {ui.seeClassification}
          </a>
        </div>
      </div>

      <p
        data-hero="cue"
        className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-xs tracking-[0.2em] text-silver-500 uppercase"
      >
        {hero.scrollCue}
        <ArrowDown aria-hidden="true" className="size-4 animate-[cue-nudge_1.8s_var(--ease-in-out-quart)_infinite]" strokeWidth={1.75} />
      </p>
    </section>
  );
}
