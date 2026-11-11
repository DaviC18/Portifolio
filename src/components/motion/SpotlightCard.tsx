import type { ElementType, PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = { children: ReactNode; as?: ElementType; className?: string };

const setSpot = (e: PointerEvent<HTMLElement>) => {
  if (e.pointerType !== "mouse") return;
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};

/**
 * Painel com brilho radial teal que segue o mouse (CSS vars `--x/--y`, sem re-render). SPEC §8.
 * Só aparece com `pointer: fine`; some com reduced-motion e com movimento pausado.
 */
export function SpotlightCard({ children, as: Tag = "div", className }: Props) {
  return (
    <Tag
      onPointerMove={setSpot}
      className={cn(
        "group relative isolate overflow-hidden rounded-panel border border-line bg-graphite-800 transition-colors duration-200 hover:bg-graphite-700",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-fine:motion-safe:block in-data-[motion=off]:hidden!"
        style={{
          background:
            "radial-gradient(360px circle at var(--x, 50%) var(--y, 50%), rgb(0 210 190 / 0.12), transparent 65%)",
        }}
      />
      {children}
    </Tag>
  );
}
