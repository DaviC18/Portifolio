import { cn } from "@/lib/utils";

/**
 * Camada de fibra de carbono em CSS (SPEC §4, `.carbon`). Substitui o `Grain` do RGóis.
 * O pai precisa de `relative isolate`.
 */
export function CarbonBg({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("carbon", className)} />;
}
