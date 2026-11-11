import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { Badge } from "@/components/ui/badge";
import { stack, stackSection } from "@/content/site";

/**
 * Setup do carro `#setup` (SPEC §5): 4 painéis (1 → 2 → 4 colunas) com código mono,
 * nome, área, descrição e tecnologias. Sem barras de domínio e sem logos.
 */
export function CarSetup() {
  return (
    <section id="setup" aria-labelledby="setup-title" className="bg-carbon-950 py-24 md:py-32">
      <div className="container-site">
        <SectionHeader
          id="setup-title"
          eyebrow={stackSection.eyebrow}
          title={stackSection.title}
          subtitle={stackSection.subtitle}
        />

        <Reveal as="ul" stagger={0.08} className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stack.map((group) => (
            <SpotlightCard as="li" key={group.code} className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between gap-3 font-mono text-xs tracking-[0.15em] uppercase">
                <span className="text-teal-400 tabular-nums">{group.code}</span>
                <span className="text-silver-500">{group.area}</span>
              </div>
              <h3 className="font-condensed text-3xl leading-none font-bold text-white uppercase">{group.name}</h3>
              <p className="text-sm leading-relaxed text-silver-300">{group.description}</p>
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <Badge variant="outline" className="h-7 rounded-panel px-2.5 font-mono text-xs text-silver-100">
                      {item}
                    </Badge>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
