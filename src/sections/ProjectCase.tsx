import { ArrowUpRight, CodeXml, TriangleAlert } from "lucide-react";
import { ImagePlaceholder } from "@/components/common/ImagePlaceholder";
import { PositionBadge } from "@/components/common/PositionBadge";
import { StatusPill } from "@/components/common/StatusPill";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { TelemetryBar } from "@/components/motion/TelemetryBar";
import { Badge } from "@/components/ui/badge";
import { isTodo, ui, type Project } from "@/content/site";
import { track } from "@/lib/track";

/** Rótulo mono pequeno dos blocos do case (Problema, Solução...). */
function BlockLabel({ children }: { children: string }) {
  return (
    <h4 className="mb-3 font-mono text-xs tracking-[0.2em] text-silver-500 uppercase">{children}</h4>
  );
}

/**
 * Case de um projeto (SPEC §6): cabeçalho, Problema/Solução/Destaques à esquerda,
 * painel de telemetria à direita, stack, links e galeria.
 * Links `TODO_DAVI`/`null` não renderizam. "Treino livre" mostra `ui.inProgressNote`.
 */
export function ProjectCase({ project: p }: { project: Project }) {
  const titleId = `caso-${p.slug}-title`;
  const max = Math.max(0, ...p.telemetry.map((t) => t.value));
  const links = [
    !isTodo(p.links.repo) && { tipo: "repo" as const, href: p.links.repo as string, label: ui.seeCode, Icon: CodeXml },
    !isTodo(p.links.live) && { tipo: "live" as const, href: p.links.live as string, label: ui.seeLive, Icon: ArrowUpRight },
  ].filter((l): l is Exclude<typeof l, false> => Boolean(l));
  const images = [p.images.cover, ...p.images.gallery].slice(0, 3);

  return (
    <article
      id={`caso-${p.slug}`}
      aria-labelledby={titleId}
      className="scroll-mt-24 border-t border-line py-16 first:border-t-0 md:py-24"
    >
      <Reveal as="header" className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <PositionBadge position={p.position} />
            <span className="font-mono text-xs tracking-wide text-silver-500 uppercase">{p.category}</span>
          </div>
          <h3
            id={titleId}
            className="font-condensed text-silver text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] font-bold uppercase"
          >
            {p.name}
          </h3>
          <p className="max-w-[60ch] text-lg leading-relaxed text-silver-300">{p.tagline}</p>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <StatusPill status={p.status} />
          {p.status === "Treino livre" && (
            <p className="max-w-[32ch] font-mono text-xs leading-relaxed text-amber md:text-right">
              {ui.inProgressNote}
            </p>
          )}
        </div>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal className="space-y-8">
          <div>
            <BlockLabel>{ui.problem}</BlockLabel>
            <p className="max-w-[65ch] leading-relaxed text-silver-100">{p.problem}</p>
          </div>
          <div>
            <BlockLabel>{ui.solution}</BlockLabel>
            <p className="max-w-[65ch] leading-relaxed text-silver-100">{p.solution}</p>
          </div>
          {p.disclaimer && (
            <div
              role="note"
              className="flex gap-3 rounded-panel border border-amber/40 bg-amber/5 p-4 text-sm leading-relaxed text-silver-100"
            >
              <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber" strokeWidth={1.75} />
              <p>{p.disclaimer}</p>
            </div>
          )}
          <div>
            <BlockLabel>{ui.highlights}</BlockLabel>
            <ul className="space-y-3">
              {p.highlights.map((h, i) => (
                <li key={i} className="flex gap-3 leading-relaxed text-silver-100">
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 font-mono text-xs text-teal-400 tabular-nums"
                  >
                    S{i + 1}
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="space-y-8">
          <div className="chamfer border-l-2 border-teal-400 bg-graphite-800 p-6 md:p-8">
            <BlockLabel>{ui.telemetry}</BlockLabel>
            {p.telemetry.length > 0 ? (
              <dl className="grid gap-6 sm:grid-cols-2">
                {p.telemetry.map((t) => (
                  <div key={t.label} className="flex flex-col gap-2">
                    <dt className="order-2 text-sm text-silver-500">{t.label}</dt>
                    <dd className="order-1">
                      <CountUp
                        value={t.value}
                        prefix={t.prefix}
                        suffix={t.suffix}
                        decimals={t.decimals}
                        className="text-4xl leading-none text-white md:text-5xl"
                      />
                    </dd>
                    <TelemetryBar value={t.value} max={max} className="order-3" />
                  </div>
                ))}
              </dl>
            ) : (
              <p className="font-mono text-sm leading-relaxed text-silver-300">{ui.telemetryPending}</p>
            )}
          </div>

          <div>
            <BlockLabel>{ui.stack}</BlockLabel>
            <ul className="flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li key={s}>
                  <Badge variant="outline" className="h-7 rounded-panel px-2.5 font-mono text-xs text-silver-100">
                    {s}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          {links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {links.map(({ tipo, href, label, Icon }) => (
                <a
                  key={tipo}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  onClick={() => track("project_link", { slug: p.slug, tipo })}
                  className="inline-flex min-h-12 items-center gap-2 rounded-panel border border-line px-5 font-semibold text-white transition-colors duration-200 hover:border-silver-500 hover:bg-graphite-700"
                >
                  <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  {label}
                  <span className="sr-only"> {ui.newTab}</span>
                </a>
              ))}
            </div>
          )}
        </Reveal>
      </div>

      <Reveal stagger={0.08} className="mt-12 grid gap-4 md:grid-cols-3">
        {images.map((src, i) => (
          // imagens ainda não existem (SPEC §9): todas viram placeholder com o nome do projeto
          <ImagePlaceholder
            key={src ?? i}
            label={p.name}
            className={i === 0 ? "md:col-span-3 lg:col-span-2" : undefined}
          />
        ))}
      </Reveal>
    </article>
  );
}
