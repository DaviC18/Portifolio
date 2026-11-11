import { Pause, Play } from "lucide-react";
import { ui } from "@/content/site";
import { useMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Pausa/retoma todas as animações (SPEC §7.5). O estado fica salvo em `localStorage["dc:motion"]`
 * e o evento `motion_toggle` sai do `MotionProvider`.
 */
export function MotionToggle({ className }: { className?: string }) {
  const { paused, toggle } = useMotion();
  const Icon = paused ? Play : Pause;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-panel border border-line px-4 font-mono text-xs tracking-[0.15em] text-silver-300 uppercase transition-colors duration-200 hover:border-silver-500 hover:text-white",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
      {paused ? ui.resumeMotion : ui.pauseMotion}
    </button>
  );
}
