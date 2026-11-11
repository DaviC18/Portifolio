import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/common/ImagePlaceholder";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatusPill } from "@/components/common/StatusPill";
import { classification, projects, ui, type Project } from "@/content/site";
import { gsap, MOTION, MQ, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";

const caseHref = (p: Project) => `#caso-${p.slug}`;

/**
 * Classificação `#classificacao` (SPEC §5): placar de cronometragem.
 * ≥768px: `<table>` real, linha inteira clicável, prévia da capa seguindo o cursor (`pointer: fine`).
 * <768px: cards empilhados com a mesma informação.
 * Entrada: linhas em stagger como placar virando e posições com ScrambleText curto.
 */
export function Classification() {
  const ref = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const { allowed } = useMotion();
  const [hovered, setHovered] = useState<Project | null>(null);
  const followRef = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);

  useGSAP(
    () => {
      if (!allowed) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>("[data-board]").forEach((board) => {
          const rows = board.querySelectorAll("[data-board-row]");
          const tl = gsap.timeline({ scrollTrigger: { trigger: board, start: "top 80%", once: true } });
          // opacity (não autoAlpha): visibility:hidden tiraria as linhas da ordem do Tab até a entrada
          tl.from(rows, { opacity: 0, y: 16, ...MOTION.reveal, stagger: MOTION.listStagger });
          board.querySelectorAll<HTMLElement>("[data-board-pos]").forEach((pos, i) => {
            tl.to(
              pos,
              { duration: 0.5, scrambleText: { text: pos.textContent ?? "", chars: "0123456789", speed: 0.6 } },
              i * MOTION.listStagger,
            );
          });
        });
      });

      // prévia seguindo o cursor (só desktop com mouse)
      mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
        const preview = previewRef.current;
        if (!preview) return;
        gsap.set(preview, { yPercent: -50, autoAlpha: 0 });
        followRef.current = {
          x: gsap.quickTo(preview, "x", { duration: 0.45, ease: "power3.out" }),
          y: gsap.quickTo(preview, "y", { duration: 0.45, ease: "power3.out" }),
        };
        return () => {
          followRef.current = null;
        };
      });
    },
    { scope: ref, dependencies: [allowed], revertOnUpdate: true },
  );

  const movePreview = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    followRef.current?.x(e.clientX + 24);
    followRef.current?.y(e.clientY);
  };
  // handlers só rodam com a prévia ativa (followRef existe só dentro do matchMedia)
  const showPreview = (p: Project, e: React.PointerEvent) => {
    if (!followRef.current || e.pointerType !== "mouse") return;
    setHovered(p);
    gsap.set(previewRef.current, { x: e.clientX + 24, y: e.clientY });
    gsap.to(previewRef.current, { autoAlpha: 1, scale: 1, ...MOTION.micro, overwrite: "auto" });
  };
  const hidePreview = () => {
    if (!followRef.current) return;
    gsap.to(previewRef.current, { autoAlpha: 0, scale: 0.96, ...MOTION.micro, overwrite: "auto" });
  };

  return (
    <section
      ref={ref}
      id="classificacao"
      aria-labelledby="classificacao-title"
      className="relative bg-carbon-950 py-24 md:py-32"
    >
      <div className="container-site">
        <SectionHeader
          id="classificacao-title"
          eyebrow={classification.eyebrow}
          title={classification.title}
          subtitle={classification.subtitle}
        />

        {/* ≥768px: placar em tabela */}
        <table data-board="" className="mt-14 hidden w-full border-collapse text-left md:table">
          <thead>
            <tr className="border-b border-line font-mono text-xs tracking-[0.2em] text-silver-500 uppercase">
              <th scope="col" className="w-20 py-3 font-normal">
                {ui.tableHeaders.position}
              </th>
              <th scope="col" className="py-3 font-normal">
                {ui.tableHeaders.project}
              </th>
              <th scope="col" className="py-3 font-normal">
                {ui.tableHeaders.status}
              </th>
              <th scope="col" className="py-3 text-right font-normal">
                {ui.tableHeaders.time}
              </th>
              <td className="w-12" />
            </tr>
          </thead>
          <tbody onPointerLeave={hidePreview}>
            {projects.map((p) => (
              <tr
                key={p.slug}
                data-board-row=""
                onPointerEnter={(e) => showPreview(p, e)}
                onPointerMove={movePreview}
                className="group relative border-b border-line transition-colors duration-200 focus-within:bg-graphite-800 hover:bg-graphite-800"
              >
                <td className="py-6 pl-2">
                  <span
                    data-board-pos=""
                    className="font-condensed text-3xl leading-none font-bold text-white tabular-nums"
                  >
                    P{p.position}
                  </span>
                </td>
                <th scope="row" className="py-6 pr-6 font-normal">
                  {/* o link cobre a linha inteira (after:inset-0) */}
                  <a
                    href={caseHref(p)}
                    className="font-display text-2xl font-semibold text-white outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-teal-400"
                  >
                    {p.name}
                  </a>
                  <span className="mt-1 block font-mono text-xs tracking-wide text-silver-500 uppercase">
                    {p.category}
                  </span>
                </th>
                <td className="py-6">
                  <StatusPill status={p.status} />
                </td>
                <td className="py-6 text-right font-mono text-sm text-silver-100 tabular-nums">
                  {p.headline}
                </td>
                <td className="py-6 pr-2 text-right">
                  <ArrowRight
                    aria-hidden="true"
                    className="pointer-events-none ml-auto size-5 text-silver-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-teal-400"
                    strokeWidth={1.75}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <768px: cards */}
        <ol data-board="" className="mt-12 space-y-3 md:hidden">
          {projects.map((p) => (
            <li key={p.slug} data-board-row="">
              <a
                href={caseHref(p)}
                className="flex items-start gap-4 rounded-panel border border-line bg-graphite-800 p-4 active:bg-graphite-700"
              >
                <span
                  data-board-pos=""
                  className="font-condensed w-10 shrink-0 text-3xl leading-none font-bold text-white tabular-nums"
                >
                  P{p.position}
                </span>
                <span className="min-w-0 flex-1 space-y-2">
                  <span className="block font-display text-xl font-semibold text-white">{p.name}</span>
                  <span className="block font-mono text-xs tracking-wide text-silver-500 uppercase">
                    {p.category}
                  </span>
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <StatusPill status={p.status} />
                    <span className="font-mono text-xs text-silver-100 tabular-nums">{p.headline}</span>
                  </span>
                </span>
                <ArrowRight aria-hidden="true" className="mt-1 size-5 shrink-0 text-silver-500" strokeWidth={1.75} />
              </a>
            </li>
          ))}
        </ol>
      </div>

      {/* prévia da capa (decorativa; o nome já está na linha) */}
      {allowed && (
        <div
          ref={previewRef}
          aria-hidden="true"
          className="pointer-events-none invisible fixed top-0 left-0 z-40 hidden w-72 opacity-0 md:block"
        >
          {hovered &&
            (hovered.images.cover ? (
              <ResponsiveImage
                src={hovered.images.cover}
                alt=""
                width={hovered.images.coverSize?.[0] ?? 1440}
                height={hovered.images.coverSize?.[1] ?? 704}
                sizes="288px"
                priority
              />
            ) : (
              <ImagePlaceholder label={hovered.name} />
            ))}
        </div>
      )}
    </section>
  );
}
