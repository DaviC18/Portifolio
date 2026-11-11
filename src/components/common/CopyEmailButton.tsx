import { Copy, Mail } from "lucide-react";
import { toast } from "sonner";
import { contact, isTodo, ui } from "@/content/site";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

type Props = {
  /** de onde veio o clique (evento `copy_email`) */
  origem: string;
  /** `ghost`: botão com borda. `small`: compacto (dock, footer). */
  variant?: "ghost" | "small";
  /** mostra o endereço ao lado do rótulo */
  showAddress?: boolean;
  className?: string;
};

const VARIANTS = {
  ghost: "min-h-14 px-7 text-base border border-line hover:border-silver-500 hover:bg-graphite-700",
  small: "min-h-11 px-4 text-sm border border-line hover:bg-graphite-700",
} as const;

/**
 * Copia `contact.email` e confirma com toast (SPEC §8).
 * Se o clipboard falhar, avisa e abre o `mailto:`.
 * Com `contact.email` pendente, não aparece no build (em dev aparece tracejado).
 */
export function CopyEmailButton({ origem, variant = "ghost", showAddress = false, className }: Props) {
  const pending = isTodo(contact.email);
  if (pending && !import.meta.env.DEV) return null;

  const copy = async () => {
    track("copy_email", { origem });
    try {
      await navigator.clipboard.writeText(contact.email);
      toast.success(ui.emailCopied);
    } catch {
      toast(ui.emailCopyFailed);
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={pending ? "TODO_DAVI: contact.email" : undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-panel font-semibold text-white transition-colors duration-200",
        VARIANTS[variant],
        pending && "outline-2 outline-offset-2 outline-amber outline-dashed",
        className,
      )}
    >
      <Mail aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.75} />
      <span>{ui.copyEmail}</span>
      {showAddress && <span className="font-mono text-sm text-silver-500">{contact.email}</span>}
      <Copy aria-hidden="true" className="size-4 shrink-0 text-silver-500" strokeWidth={1.75} />
    </button>
  );
}
