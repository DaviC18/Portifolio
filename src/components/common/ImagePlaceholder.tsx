import { CarbonBg } from "@/components/motion/CarbonBg";
import { profile, ui } from "@/content/site";
import { cn } from "@/lib/utils";

const RATIOS = {
  "16/10": "aspect-[16/10]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
} as const;

type Props = {
  ratio?: keyof typeof RATIOS;
  /** nome do que vai aparecer aqui (ex.: nome do projeto) */
  label: string;
  className?: string;
};

/** Lugar de imagem enquanto as fotos não chegam (SPEC §9). Sem imagem de banco nem gerada. */
export function ImagePlaceholder({ ratio = "16/10", label, className }: Props) {
  return (
    <div
      role="img"
      aria-label={`${label} · ${ui.imageSoon}`}
      className={cn(
        "relative isolate flex w-full flex-col justify-end overflow-hidden rounded-panel border border-line bg-graphite-800 p-4 md:p-5",
        RATIOS[ratio],
        className,
      )}
    >
      <CarbonBg />
      <span
        aria-hidden="true"
        className="font-condensed absolute top-3 right-4 text-2xl leading-none font-bold text-silver-500/60"
      >
        {profile.number}
      </span>
      <span aria-hidden="true" className="font-display text-lg font-semibold text-silver-300">
        {label}
      </span>
      <span aria-hidden="true" className="font-mono text-xs tracking-[0.2em] text-silver-500 uppercase">
        {ui.imageSoon}
      </span>
    </div>
  );
}
