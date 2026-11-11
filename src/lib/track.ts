/**
 * Tracking de eventos (SPEC §2). Hoje é no-op (com `console.debug` em dev).
 * Pronto para plugar Vercel Analytics depois, sem mexer nos componentes.
 */
export type TrackEvents = {
  cta_whatsapp: { origem: string };
  copy_email: { origem: string };
  project_link: { slug: string; tipo: "repo" | "live" };
  intro_skip: Record<string, never>;
  motion_toggle: { estado: "on" | "off" };
};

export type TrackEvent = keyof TrackEvents;

export function track<E extends TrackEvent>(event: E, props: TrackEvents[E]) {
  if (import.meta.env.DEV) console.debug("[track]", event, props);
}
