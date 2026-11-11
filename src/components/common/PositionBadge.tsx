import { cn } from "@/lib/utils";

type Props = {
  position: number;
  size?: "sm" | "lg";
  className?: string;
};

/** "P1"…"P4" em display condensado, caixa graphite com borda teal à esquerda. SPEC §8. */
export function PositionBadge({ position, size = "sm", className }: Props) {
  return (
    <span
      className={cn(
        "font-condensed inline-flex items-center border-l-2 border-teal-400 bg-graphite-800 leading-none font-bold text-white tabular-nums",
        size === "sm" ? "px-2.5 py-1.5 text-lg" : "px-4 py-2.5 text-4xl",
        className,
      )}
    >
      P{position}
    </span>
  );
}
