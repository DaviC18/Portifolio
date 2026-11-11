import { cn } from "@/lib/utils";

const RATIOS = {
  "16/10": "aspect-[16/10]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
} as const;

type Props = {
  /** WebP maior (ex.: `/images/projects/x-cover.webp`); variantes `-640`/`-960` ficam ao lado */
  src: string;
  alt: string;
  /** largura e altura do arquivo `src`, para reservar espaço (CLS) */
  width: number;
  height: number;
  ratio?: keyof typeof RATIOS;
  /** atributo `sizes` do srcset */
  sizes: string;
  /** variantes menores geradas ao lado do arquivo */
  variants?: number[];
  /** imagem acima da dobra: sem lazy */
  priority?: boolean;
  /** `object-position` do recorte (padrão: topo, bom para capturas de tela) */
  position?: string;
  className?: string;
};

/**
 * Imagem com srcset WebP no recorte da SPEC §9 (16:10 nas capas, 4:5 na foto).
 * Lazy + decoding async por padrão; mesmo quadro do ImagePlaceholder.
 */
export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  ratio = "16/10",
  sizes,
  variants = [640, 960],
  priority = false,
  position = "top",
  className,
}: Props) {
  const srcSet = [...variants.filter((w) => w < width).map((w) => `${src.replace(/\.webp$/, `-${w}.webp`)} ${w}w`), `${src} ${width}w`].join(
    ", ",
  );
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-panel border border-line bg-graphite-800",
        RATIOS[ratio],
        className,
      )}
    >
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 size-full object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
