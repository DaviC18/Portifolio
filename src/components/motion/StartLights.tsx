import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CarbonBg } from "@/components/motion/CarbonBg";
import { SpeedLines } from "@/components/motion/SpeedLines";
import { intro, ui } from "@/content/site";
import { gsap, MOTION, useGSAP } from "@/lib/gsap";
import { markIntroSeen, shouldRunIntro } from "@/lib/intro";
import { start as startScroll, stop as stopScroll } from "@/lib/lenis";
import { useMotion } from "@/lib/motion";
import { track } from "@/lib/track";

const COLUMNS = 5;
/** intervalo entre colunas acendendo (SPEC §7.2) */
const STEP = 0.35;

const main = () => document.getElementById("conteudo");
/** header, skip link, rodapé e dock: fora do overlay, ficam inert junto com o main */
const outside = () =>
  Array.from(document.querySelectorAll<HTMLElement>("[data-site-header], footer, a[href='#conteudo']"));

type Props = {
  /** Chamado quando o hero pode começar a entrada: na arrancada, no pulo ou logo de cara se a intro não roda. */
  onComplete?: () => void;
};

/**
 * Intro de largada (SPEC §7.2): 5 colunas de luzes acendem a cada 0.35s, espera 0.3–0.6s,
 * apagam juntas, SpeedLines cruzam e o overlay sai com clip-path de baixo para cima. Total ≤ 3.2s.
 * Durante a intro: scroll parado e `<main>` com `inert`. "Pular largada" e Esc encerram na hora.
 * Não roda com reduced-motion, com movimento pausado nem em visitas repetidas na sessão.
 */
export function StartLights({ onComplete }: Props) {
  const { allowed } = useMotion();
  // decidido uma vez, na montagem: pausar depois não reinicia nem esconde a intro
  const [running, setRunning] = useState(() => shouldRunIntro(allowed));
  const [launch, setLaunch] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const onCompleteRef = useRef(onComplete);
  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  });

  // intro não roda: o hero começa direto
  useEffect(() => {
    if (!running) onCompleteRef.current?.();
    // só na montagem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      if (!running) return;
      markIntroSeen();
      stopScroll();
      main()?.setAttribute("inert", "");
      outside().forEach((el) => el.setAttribute("inert", ""));
      ref.current?.querySelector<HTMLButtonElement>("[data-skip]")?.focus({ preventScroll: true });

      let heroStarted = false;
      const startHero = () => {
        if (heroStarted) return;
        heroStarted = true;
        onCompleteRef.current?.();
      };

      const finish = () => {
        startHero();
        const m = main();
        m?.removeAttribute("inert");
        outside().forEach((el) => el.removeAttribute("inert"));
        startScroll();
        if (m) {
          if (!m.hasAttribute("tabindex")) m.setAttribute("tabindex", "-1");
          m.focus({ preventScroll: true });
        }
        setRunning(false);
      };

      const tl = gsap.timeline({ onComplete: finish });
      tlRef.current = tl;

      // 1. acendem, uma coluna por vez
      for (let i = 0; i < COLUMNS; i++) {
        tl.set(`[data-light-col="${i}"] [data-light-on]`, { opacity: 1 }, 0.2 + i * STEP);
      }
      // 2–3. espera aleatória e apagam juntas, instantâneo
      const off = 0.2 + (COLUMNS - 1) * STEP + gsap.utils.random(0.3, 0.6);
      tl.set("[data-light-on]", { opacity: 0 }, off);
      // 4. arrancada: SpeedLines cruzam (0.35s) e o overlay sai de baixo para cima
      tl.call(() => setLaunch(true), [], off);
      tl.call(startHero, [], off + 0.2);
      tl.fromTo(
        ref.current,
        { clipPath: "inset(0% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 100% 0%)", ...MOTION.overlay },
        off + 0.2,
      );

      // desmontou no meio (StrictMode, HMR): nunca deixar a página travada
      return () => {
        main()?.removeAttribute("inert");
        outside().forEach((el) => el.removeAttribute("inert"));
        startScroll();
      };
    },
    { scope: ref, dependencies: [running] },
  );

  /** "Pular largada" e Esc: leva a timeline ao fim, o que dispara a limpeza normal. */
  const skip = () => {
    const tl = tlRef.current;
    if (!tl || tl.progress() === 1) return;
    track("intro_skip", {});
    tl.progress(1);
  };

  useEffect(() => {
    if (!running) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const tl = tlRef.current;
      if (!tl || tl.progress() === 1) return;
      track("intro_skip", {});
      tl.progress(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running]);

  if (!running) return null;

  return (
    <div ref={ref} className="fixed inset-0 z-[200] isolate overflow-hidden bg-carbon-950">
      <CarbonBg />
      <SpeedLines variant="intro" active={launch} />

      <p
        aria-hidden="true"
        className="absolute top-5 left-5 font-mono text-xs tracking-[0.2em] text-silver-500 uppercase md:top-8 md:left-8"
      >
        {intro.gridLabel}
      </p>

      <div aria-hidden="true" className="flex h-full flex-col items-center justify-center gap-8 px-5">
        <div className="flex gap-2 sm:gap-3">
          {Array.from({ length: COLUMNS }, (_, col) => (
            <div
              key={col}
              data-light-col={col}
              className="flex flex-col gap-2 rounded-panel border border-line bg-graphite-800 p-2 sm:gap-3 sm:p-3"
            >
              {[0, 1].map((row) => (
                <span key={row} className="relative block size-9 rounded-full bg-carbon-950 sm:size-12">
                  <span
                    data-light-on=""
                    className="absolute inset-0 rounded-full bg-signal-red opacity-0 shadow-[0_0_24px_6px_rgb(225_6_0/0.55)]"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="font-condensed text-silver text-4xl leading-none font-bold">{intro.number}</p>
      </div>

      <button
        type="button"
        data-skip=""
        onClick={skip}
        className="absolute right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] inline-flex min-h-11 items-center rounded-panel border border-line bg-carbon-950/80 px-4 font-mono text-xs tracking-[0.15em] text-silver-300 uppercase transition-colors duration-200 hover:border-silver-500 hover:text-white md:right-8 md:bottom-8"
      >
        {ui.skipIntro}
      </button>
    </div>
  );
}
