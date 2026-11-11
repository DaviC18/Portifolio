/**
 * Estado global de movimento (SPEC §7.5).
 * `allowed = !prefersReducedMotion && !paused`. `paused` vem do MotionToggle
 * e fica salvo em `localStorage["dc:motion"]`.
 */
import { createContext, use, useCallback, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { finishAllAnimations } from "./gsap";
import { track } from "./track";
import { useReducedMotion } from "./useReducedMotion";

const STORAGE_KEY = "dc:motion";

type MotionState = {
  /** Pode animar: sem reduced-motion e sem pausa. */
  allowed: boolean;
  /** Usuário pausou pelo MotionToggle. */
  paused: boolean;
  toggle: () => void;
};

const MotionContext = createContext<MotionState | null>(null);

function readPaused() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "off";
  } catch {
    return false;
  }
}

function writePaused(paused: boolean) {
  try {
    if (paused) localStorage.setItem(STORAGE_KEY, "off");
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage bloqueado: a pausa vale só nesta visita
  }
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(readPaused);

  // antes da pintura, para os componentes já lerem o atributo certo
  useLayoutEffect(() => {
    const html = document.documentElement;
    if (paused) {
      html.dataset.motion = "off";
      finishAllAnimations();
    } else {
      delete html.dataset.motion;
    }
  }, [paused]);

  const toggle = useCallback(() => {
    const next = !paused;
    writePaused(next);
    track("motion_toggle", { estado: next ? "off" : "on" });
    setPaused(next);
  }, [paused]);

  const value = useMemo<MotionState>(
    () => ({ allowed: !reduced && !paused, paused, toggle }),
    [reduced, paused, toggle],
  );

  return <MotionContext value={value}>{children}</MotionContext>;
}

export function useMotion() {
  const ctx = use(MotionContext);
  if (!ctx) throw new Error("useMotion precisa estar dentro de <MotionProvider>");
  return ctx;
}
