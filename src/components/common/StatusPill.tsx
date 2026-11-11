import type { ProjectStatus } from "@/content/site";
import { cn } from "@/lib/utils";

const DOT: Record<ProjectStatus, string> = {
  "Em produção": "bg-teal-400",
  Entregue: "bg-silver-300",
  "Treino livre": "bg-amber",
};

/**
 * Status do projeto (SPEC §6): "Em produção" com ponto teal pulsando,
 * "Entregue" com ponto prata fixo, "Treino livre" com ponto âmbar.
 * O pulso é CSS e para com reduced-motion e com movimento pausado.
 */
export function StatusPill({ status, className }: { status: ProjectStatus; className?: string }) {
  const live = status === "Em produção";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-carbon-950/60 px-3 py-1 font-mono text-xs tracking-wide text-silver-100 uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="relative flex size-2">
        {live && (
          <span className="absolute inset-0 animate-ping rounded-full bg-teal-400 opacity-60 motion-reduce:hidden in-data-[motion=off]:hidden" />
        )}
        <span className={cn("relative size-2 rounded-full", DOT[status])} />
      </span>
      {status}
    </span>
  );
}
