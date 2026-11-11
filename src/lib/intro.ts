/**
 * Regra de quando a intro de largada roda (SPEC §7.2). Fica fora do StartLights
 * para o App decidir sem baixar o chunk lazy da intro.
 */
const SEEN_KEY = "dc:intro-seen";

/** Só na primeira visita da sessão e com movimento permitido. Se o storage falhar, não roda. */
export function shouldRunIntro(allowed: boolean) {
  if (!allowed) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) === null;
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // sem storage: shouldRunIntro já devolveu false
  }
}
