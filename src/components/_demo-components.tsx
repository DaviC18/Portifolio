/**
 * Vitrine dos componentes base (Fase 1). Abre em `?demo=components`, só em dev.
 * Removido na Fase 3. Textos de rótulo daqui são só de teste, não vão para o site.
 */
import { CopyEmailButton } from "@/components/common/CopyEmailButton";
import { ImagePlaceholder } from "@/components/common/ImagePlaceholder";
import { MotionToggle } from "@/components/common/MotionToggle";
import { PitButton } from "@/components/common/PitButton";
import { PositionBadge } from "@/components/common/PositionBadge";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SkipLink } from "@/components/common/SkipLink";
import { StatusPill } from "@/components/common/StatusPill";
import { CarbonBg } from "@/components/motion/CarbonBg";
import { CountUp } from "@/components/motion/CountUp";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { TelemetryBar } from "@/components/motion/TelemetryBar";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { classification, projects, stack, stackSection } from "@/content/site";
import { useMotion } from "@/lib/motion";

function Block({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 border-t border-line pt-6">
      <p className="font-mono text-xs tracking-[0.2em] text-teal-400 uppercase">{name}</p>
      {children}
    </div>
  );
}

export default function DemoComponents() {
  const { allowed, paused } = useMotion();
  const mariana = projects[0]!;
  const max = Math.max(...mariana.telemetry.map((t) => t.value));

  return (
    <>
      <SkipLink />
      <div className="sticky top-0 z-50 border-b border-line bg-carbon-950/90 backdrop-blur">
        <div className="container-site flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
          <p className="font-mono text-xs text-silver-500">
            demo=components · allowed={String(allowed)} · paused={String(paused)}
          </p>
          <MotionToggle />
        </div>
      </div>

      <main id="conteudo" className="container-site space-y-16 py-16">
        <Block name="SectionHeader + SplitHeading">
          <SectionHeader
            id="demo-classificacao"
            eyebrow={classification.eyebrow}
            title={classification.title}
            subtitle={classification.subtitle}
          />
        </Block>

        <Block name="PitButton · MagneticButton · CopyEmailButton">
          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton>
              <PitButton origem="demo-primary" />
            </MagneticButton>
            <PitButton origem="demo-ghost" variant="ghost" />
            <PitButton origem="demo-small" variant="small" />
            <CopyEmailButton origem="demo" />
            <CopyEmailButton origem="demo" variant="small" />
          </div>
          <p className="font-mono text-xs text-amber">
            Tracejado âmbar = contato TODO_DAVI (só aparece em dev; some no build).
          </p>
        </Block>

        <Block name="StatusPill · PositionBadge">
          <div className="flex flex-wrap items-center gap-4">
            {projects.map((p) => (
              <div key={p.slug} className="flex items-center gap-3">
                <PositionBadge position={p.position} />
                <StatusPill status={p.status} />
              </div>
            ))}
            <PositionBadge position={1} size="lg" />
          </div>
        </Block>

        <Block name="CountUp + TelemetryBar (chamfer)">
          <div className="chamfer grid gap-6 bg-graphite-800 p-6 sm:grid-cols-2">
            {mariana.telemetry.map((t) => (
              <div key={t.label} className="space-y-2">
                <CountUp
                  value={t.value}
                  prefix={t.prefix}
                  suffix={t.suffix}
                  decimals={t.decimals}
                  className="text-4xl text-white"
                />
                <p className="text-sm text-silver-500">{t.label}</p>
                <TelemetryBar value={t.value} max={max} />
              </div>
            ))}
          </div>
        </Block>

        <Block name="SpotlightCard + Badge">
          <Reveal stagger={0.06} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stack.map((s) => (
              <SpotlightCard key={s.code} className="space-y-3 p-5">
                <p className="font-mono text-xs text-silver-500">{s.code}</p>
                <h3 className="font-condensed text-2xl font-bold uppercase">{s.name}</h3>
                <p className="text-sm text-silver-500">{s.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.items.map((i) => (
                    <Badge key={i} variant="outline" className="font-mono">
                      {i}
                    </Badge>
                  ))}
                </div>
              </SpotlightCard>
            ))}
          </Reveal>
          <p className="text-sm text-silver-500">{stackSection.subtitle}</p>
        </Block>

        <Block name="ImagePlaceholder (16/10 · 4/5 · 1/1)">
          <div className="grid gap-4 sm:grid-cols-3">
            <ImagePlaceholder label={mariana.name} />
            <ImagePlaceholder ratio="4/5" label="Davi Curty" />
            <ImagePlaceholder ratio="1/1" label={projects[3]!.name} />
          </div>
        </Block>

        <Block name="Reveal + CarbonBg">
          <Reveal className="relative isolate overflow-hidden rounded-panel border border-line p-10">
            <CarbonBg />
            <p className="max-w-[65ch] leading-relaxed">{mariana.solution}</p>
          </Reveal>
        </Block>

        <div className="h-[40vh]" />
      </main>
      <Toaster />
    </>
  );
}
