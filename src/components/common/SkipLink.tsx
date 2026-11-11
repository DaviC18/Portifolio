import { ui } from "@/content/site";

/** "Pular para o conteúdo" → `#conteudo` (o `<main>`), visível só no foco. SPEC §5. */
export function SkipLink() {
  return (
    <a
      href="#conteudo"
      className="sr-only-focusable fixed top-3 left-3 z-[1000] inline-flex min-h-11 items-center rounded-panel bg-teal-400 px-4 font-semibold text-carbon-950"
    >
      {ui.skipLink}
    </a>
  );
}
