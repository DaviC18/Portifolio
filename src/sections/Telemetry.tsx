import { SectionHeader } from "@/components/common/SectionHeader";
import { projects, ui } from "@/content/site";
import { ProjectCase } from "@/sections/ProjectCase";

/** Telemetria `#telemetria` (SPEC §5 e §6): um ProjectCase por projeto, P1 → P4. */
export function Telemetry() {
  const ordered = [...projects].sort((a, b) => a.position - b.position);
  return (
    <section id="telemetria" aria-labelledby="telemetria-title" className="bg-carbon-900 py-24 md:py-32">
      <div className="container-site">
        <SectionHeader id="telemetria-title" title={ui.telemetry} />
        <div className="mt-8">
          {ordered.map((p) => (
            <ProjectCase key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
