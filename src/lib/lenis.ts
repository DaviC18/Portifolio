/**
 * Scroll suave com Lenis, sincronizado com o ScrollTrigger (SPEC §7.6).
 * Só existe com movimento permitido: reduced-motion ou pausa destroem a instância
 * e as âncoras caem no scroll nativo sem animação.
 */
import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { useMotion } from "./motion";

let lenis: Lenis | null = null;

/** Altura do header fixo, usada como offset nas âncoras. */
const headerOffset = () =>
  -(document.querySelector<HTMLElement>("[data-site-header]")?.offsetHeight ?? 0);

/** Rola até um alvo (seletor, elemento ou posição) descontando o header. */
export function scrollTo(target: string | HTMLElement | number) {
  if (lenis) {
    lenis.scrollTo(target, { offset: headerOffset() });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  const top =
    typeof el === "number"
      ? el
      : el
        ? el.getBoundingClientRect().top + window.scrollY + headerOffset()
        : null;
  if (top !== null) window.scrollTo({ top, behavior: "auto" });
}

/** Para o scroll (intro rodando, menu aberto). Sem Lenis, trava o overflow. */
export function stop() {
  if (lenis) lenis.stop();
  else document.documentElement.style.overflow = "hidden";
}

/** Libera o scroll parado por `stop()`. */
export function start() {
  document.documentElement.style.overflow = "";
  lenis?.start();
}

/**
 * Inicializa o Lenis (chamar uma vez, no App). Recria/destrói quando o
 * movimento é liberado/pausado. Retorna os controles para quem preferir hook.
 */
export function useLenis() {
  const { allowed } = useMotion();

  useEffect(() => {
    if (!allowed) return;

    const instance = new Lenis({ autoRaf: false });
    lenis = instance;

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, [allowed]);

  return { scrollTo, stop, start };
}

/**
 * Links `#ancora` da página rolam com offset do header e movem o foco
 * para a seção (teclado e leitor de tela acompanham).
 */
export function useAnchorScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = a?.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      // o link pode vir do menu mobile, que trava o scroll; navegar sempre destrava
      start();
      scrollTo(target);
      history.replaceState(null, "", hash);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
