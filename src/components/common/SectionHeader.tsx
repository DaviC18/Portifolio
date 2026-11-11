import { SplitHeading } from "@/components/motion/SplitHeading";
import { cn } from "@/lib/utils";

type Props = {
  /** id do h2, usado no `aria-labelledby` da seção */
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

/** Eyebrow mono + h2 display (SplitHeading) + subtítulo opcional. SPEC §4 e §8. */
export function SectionHeader({ id, eyebrow, title, subtitle, align = "left", className }: Props) {
  return (
    <header className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-4 font-mono text-xs tracking-[0.2em] text-silver-500 uppercase tabular-nums">
          {eyebrow}
        </p>
      )}
      <SplitHeading
        id={id}
        text={title}
        className="font-condensed text-silver text-[clamp(2.25rem,5vw,4rem)] leading-[0.95] font-bold text-balance uppercase"
        lineClassName="text-silver"
      />
      {subtitle && (
        <p
          className={cn(
            "mt-5 max-w-[65ch] text-base leading-relaxed text-silver-500 md:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
