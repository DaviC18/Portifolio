import { MotionToggle } from "@/components/common/MotionToggle";
import { contact, footer, isTodo, profile, ui, whatsappLink } from "@/content/site";
import { track } from "@/lib/track";

/** faixa quadriculada em CSS (SPEC §5), 12px */
const CHECKER = {
  backgroundImage: "conic-gradient(var(--color-silver-300) 25%, var(--color-carbon-950) 0 50%, var(--color-silver-300) 0 75%, var(--color-carbon-950) 0)",
  backgroundSize: "12px 12px",
};

const LINK = "inline-flex min-h-11 items-center text-silver-300 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline";

/** Rodapé (SPEC §5): faixa quadriculada, Folio, crédito, aviso, contatos em texto e MotionToggle. */
export function Footer() {
  const year = new Date().getFullYear();
  const links = [
    !isTodo(contact.whatsapp) && {
      key: "whatsapp",
      href: whatsappLink(),
      label: ui.callBox,
      external: true,
      onClick: () => track("cta_whatsapp", { origem: "footer" }),
    },
    !isTodo(contact.email) && { key: "email", href: `mailto:${contact.email}`, label: ui.sendEmail, external: false },
    !isTodo(contact.github) && { key: "github", href: contact.github, label: ui.github, external: true },
    !isTodo(contact.linkedin) && { key: "linkedin", href: contact.linkedin, label: ui.linkedin, external: true },
  ].filter((l): l is Exclude<typeof l, false> => Boolean(l));

  return (
    <footer className="bg-carbon-950">
      <div aria-hidden="true" className="h-3 w-full opacity-80" style={CHECKER} />
      <div className="container-site grid gap-10 py-14 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-4">
          <p className="font-condensed text-silver text-4xl leading-none font-bold uppercase">{footer.folio}</p>
          <p className="text-silver-300">{footer.credit}</p>
          <ul className="flex flex-wrap gap-x-6">
            {links.map((l) => (
              <li key={l.key}>
                <a
                  href={l.href}
                  className={LINK}
                  onClick={"onClick" in l ? l.onClick : undefined}
                  {...(l.external && { target: "_blank", rel: "noopener" })}
                >
                  {l.label}
                  {l.external && <span className="sr-only"> {ui.newTab}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <MotionToggle />
      </div>
      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-3 py-6 font-mono text-xs leading-relaxed text-silver-500 md:flex-row md:justify-between">
          <p className="max-w-[70ch]">{footer.disclaimer}</p>
          <p className="shrink-0 tabular-nums">
            © {year} {profile.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
