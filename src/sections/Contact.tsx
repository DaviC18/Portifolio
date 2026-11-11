import { ArrowUpRight, CodeXml, FileDown, UserRound } from "lucide-react";
import { CopyEmailButton } from "@/components/common/CopyEmailButton";
import { PitButton } from "@/components/common/PitButton";
import { SectionHeader } from "@/components/common/SectionHeader";
import { CarbonBg } from "@/components/motion/CarbonBg";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { contact, contactSection, isTodo, ui } from "@/content/site";

const GHOST =
  "inline-flex min-h-14 items-center justify-center gap-2.5 rounded-panel border border-line px-7 font-semibold text-white transition-colors duration-200 hover:border-silver-500 hover:bg-graphite-700";

/**
 * Chamar o box `#box` (SPEC §5): WhatsApp (primário), copiar e-mail, GitHub, LinkedIn
 * e currículo opcional. Links `TODO_DAVI` não renderizam.
 */
export function Contact() {
  const external = [
    !isTodo(contact.github) && { key: "github", href: contact.github, label: ui.github, Icon: CodeXml },
    !isTodo(contact.linkedin) && { key: "linkedin", href: contact.linkedin, label: ui.linkedin, Icon: UserRound },
  ].filter((l): l is Exclude<typeof l, false> => Boolean(l));

  return (
    <section id="box" aria-labelledby="box-title" className="relative isolate overflow-hidden bg-carbon-950 py-24 md:py-36">
      <CarbonBg />
      <div className="container-site">
        <SectionHeader
          id="box-title"
          eyebrow={contactSection.eyebrow}
          title={contactSection.title}
          subtitle={contactSection.subtitle}
        />

        <Reveal
          stagger={0.06}
          className="mt-12 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-4"
        >
          <div className="[&:not(:has(a))]:hidden">
            <MagneticButton className="w-full sm:w-auto">
              <PitButton origem="box" className="w-full" />
            </MagneticButton>
          </div>
          <CopyEmailButton origem="box" />
          {external.map(({ key, href, label, Icon }) => (
            <a key={key} href={href} target="_blank" rel="noopener" className={GHOST}>
              <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
              {label}
              <ArrowUpRight aria-hidden="true" className="size-4 text-silver-500" strokeWidth={1.75} />
              <span className="sr-only"> {ui.newTab}</span>
            </a>
          ))}
          {contact.cvUrl && (
            <a href={contact.cvUrl} download className={GHOST}>
              <FileDown aria-hidden="true" className="size-5" strokeWidth={1.75} />
              {ui.downloadCv}
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
