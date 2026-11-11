import { useRef } from "react";
import { ImagePlaceholder } from "@/components/common/ImagePlaceholder";
import { Reveal } from "@/components/motion/Reveal";
import { about, isTodo, profile } from "@/content/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";

/**
 * Card de piloto `#piloto` (SPEC §5): foto (placeholder 4:5) com reveal em clip-path
 * de baixo para cima e, ao lado, "12", nome, cargo, ficha mono e parágrafos.
 * Fatos e parágrafos `TODO_DAVI` não aparecem.
 */
export function DriverCard() {
  const ref = useRef<HTMLElement>(null);
  const { allowed } = useMotion();
  const facts = about.facts.filter((f) => !isTodo(f.value));
  const paragraphs = about.paragraphs.filter((p) => !isTodo(p));

  useGSAP(
    () => {
      if (!allowed) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // exceção permitida pela SPEC §7.6: clip-path no reveal da foto
        gsap.fromTo(
          "[data-driver-photo]",
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power4.inOut",
            scrollTrigger: { trigger: "[data-driver-photo]", start: "top 80%", once: true },
          },
        );
      });
    },
    { scope: ref, dependencies: [allowed], revertOnUpdate: true },
  );

  return (
    <section ref={ref} id="piloto" aria-labelledby="piloto-title" className="bg-carbon-900 py-24 md:py-32">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div data-driver-photo="" className="mx-auto w-full max-w-md lg:max-w-none">
          {/* foto ainda não existe (SPEC §9) */}
          <ImagePlaceholder ratio="4/5" label={profile.name} />
        </div>

        <Reveal className="space-y-8">
          <div>
            <p className="mb-4 font-mono text-xs tracking-[0.2em] text-silver-500 uppercase">{about.eyebrow}</p>
            <div className="flex items-end gap-5">
              <span
                aria-hidden="true"
                className="font-condensed text-silver text-[clamp(5rem,14vw,9rem)] leading-[0.8] font-bold"
              >
                {profile.number}
              </span>
              <div className="pb-1">
                <h2
                  id="piloto-title"
                  className="font-condensed text-silver text-[clamp(2.25rem,5vw,4rem)] leading-[0.95] font-bold uppercase"
                >
                  {about.title}
                </h2>
                <p className="mt-2 font-display text-lg font-semibold text-white">
                  {profile.name} · {profile.role}
                </p>
              </div>
            </div>
          </div>

          {facts.length > 0 && (
            <dl className="grid grid-cols-1 border-t border-line font-mono text-sm sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label} className="flex justify-between gap-4 border-b border-line py-3 sm:pr-6">
                  <dt className="text-xs tracking-[0.15em] text-silver-500 uppercase">{f.label}</dt>
                  <dd className="text-right text-white tabular-nums">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {paragraphs.length > 0 && (
            <div className="max-w-[65ch] space-y-4 text-lg leading-relaxed text-silver-100">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
