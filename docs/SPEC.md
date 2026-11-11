# SPEC: Portfólio Davi Curty (single page)

> Documento de referência para os agentes. Em caso de conflito: **SPEC.md > PLAN.md > skills > bom senso**.
> Conteúdo textual: **somente** `src/content/site.ts`. Nunca inventar texto, número, projeto, cliente ou experiência.

---

## 1. Contexto

| | |
|---|---|
| **Dono** | Davi Curty, Desenvolvedor Full-stack (sites, APIs, automações e agentes de IA) |
| **Número de piloto** | **#12** (aparece na intro, no hero, no header, no card de piloto, no favicon e na imagem OG) |
| **Tema** | Fórmula 1, inspirado na estética "Flechas de Prata": preto, prata metálica, verde-água, fibra de carbono, telemetria e cronometragem |
| **Conceito** | O site é uma corrida: largada (intro) → grid (hero) → classificação (projetos) → telemetria (cases) → setup do carro (stack) → card do piloto (sobre) → chamar o box (contato) |
| **Público** | Quem contrata desenvolvimento (donos de negócio, agências, startups) e recrutadores técnicos |
| **Referências** | Rauno Freiberg (frase como hero), Brittany Chiang (stack em tags + links reais), Dennis Snellenberg (cidade e disponibilidade no topo), Emil Kowalski (seção "agora"), Olivier Larose ("Folio 2026"), Bruno Simon (toque interativo de assinatura), Benjamin Von Wong (números de resultado), Abhay Rohit (botão de pausar movimento) |

### 1.1 Limite de marca (obrigatório)

O tema é **inspirado** em F1. É proibido:
- estrela da Mercedes, as palavras "Mercedes", "AMG", "Petronas", e "Formula 1"/"F1" como logotipo ou marca;
- logo da F1, a fonte oficial da F1 (Formula1 Display), capacetes, carros, pilotos ou circuitos reais;
- qualquer coisa que faça o site parecer oficial de uma equipe.

Permitido: paleta preta/prata/verde-água, fibra de carbono, linguagem de corrida (grid, box, telemetria, P1, volta, setor, DRS), luzes de largada genéricas e um traçado de pista **fictício** desenhado do zero.

O rodapé traz o aviso `footer.disclaimer` de `site.ts`.

### 1.2 Confidencialidade

O projeto Mariana é feito para uma **administradora de consórcio**. O nome do cliente **nunca** aparece no site: texto, `alt`, metadados, comentários, nomes de arquivo ou imagens.

## 2. Objetivo e métrica

**Objetivo:** fazer quem visita entender em 5 segundos quem é o Davi e o que ele constrói, ver projetos reais com profundidade técnica e chamar para conversar.

- CTA primário: WhatsApp (`whatsappLink()` de `site.ts`). Secundários: copiar e-mail, GitHub, LinkedIn.
- Contato a **um clique** de qualquer ponto: header (desktop) e `ContactDock` (mobile).
- Eventos via `src/lib/track.ts` (no-op + `console.debug` em dev, pronto para Vercel Analytics):
  - `cta_whatsapp` `{ origem }`
  - `copy_email` `{ origem }`
  - `project_link` `{ slug, tipo: "repo" | "live" }`
  - `intro_skip` `{}`
  - `motion_toggle` `{ estado: "on" | "off" }`

## 3. Stack

- **Vite** (última estável) + **React 19** + **TypeScript** (`strict`, `noUncheckedIndexedAccess`), alias `@/` → `src/`
- **Tailwind CSS v4** via `@tailwindcss/vite`, tokens em `@theme` no `src/styles/index.css` (sem `tailwind.config.js`)
- **shadcn/ui** (init para Vite + Tailwind v4), só estes componentes: `button`, `badge`, `tooltip`, `sheet`, `sonner`. Restilizados com os tokens da §4
- **GSAP 3** + `@gsap/react` (`useGSAP`), plugins: `ScrollTrigger`, `SplitText`, `ScrambleTextPlugin`, `MotionPathPlugin`, `Flip`, `DrawSVGPlugin`, `CustomEase` (todos inclusos no pacote `gsap`)
- **Lenis** para scroll suave, integrado ao `ScrollTrigger` e desligado com movimento reduzido ou pausado
- **lucide-react** para ícones
- **Fontes** self-hosted via `@fontsource` (sem Google Fonts em runtime), ver §4
- **React Bits:** permitido **apenas** variantes TS + Tailwind que usem GSAP ou CSS puro, e só se a SPEC não descrever o componente. Registrar no relatório
- **Proibido:** Framer Motion/`motion`, Three.js/WebGL, roteador, CSS-in-JS, outra biblioteca de UI
- Deploy na **Vercel** (estático, output `dist`)

## 4. Identidade visual

Direção: **"engenharia de pista premium"**. Escuro, preciso, técnico, com prata metálica nos títulos e verde-água só onde há ação ou dado ao vivo.

### Tokens (`@theme`)

```css
--color-carbon-950: #0A0A0B;   /* fundo base */
--color-carbon-900: #111214;   /* seções alternadas */
--color-graphite-800: #16171A; /* painéis, cards */
--color-graphite-700: #202227; /* hover de painel */
--color-line: #2A2C31;         /* bordas e divisores */
--color-silver-100: #EEF0F2;
--color-silver-300: #C5C9CE;   /* títulos */
--color-silver-500: #8E949B;   /* texto secundário (AA sobre carbon) */
--color-white: #F4F5F6;        /* texto principal */
--color-teal-400: #00D2BE;     /* destaque: CTA, foco, dado ao vivo */
--color-teal-600: #00A19C;     /* hover/pressed do teal */
--color-signal-red: #E10600;   /* SOMENTE luzes de largada */

--font-display: "Saira Variable", "Saira", system-ui, sans-serif;
--font-sans: "Titillium Web", system-ui, sans-serif;
--font-mono: "JetBrains Mono Variable", ui-monospace, monospace;

--radius-panel: 0.5rem;
--ease-out-expo: cubic-bezier(.16,1,.3,1);
--ease-in-out-quart: cubic-bezier(.76,0,.24,1);
```

Utilitários em CSS:
- `.text-silver`: texto com gradiente metálico `linear-gradient(180deg, #F4F5F6 0%, #C5C9CE 45%, #7D838A 100%)` + `background-clip: text`. Só em títulos display e no "12".
- `.carbon`: textura de fibra de carbono em CSS (dois `repeating-linear-gradient` cruzados), opacidade 3–5%. Sem imagem.
- `.chamfer`: canto chanfrado via `clip-path: polygon(...)` estático em painéis de telemetria (decorativo, não animado).
- `.container-site`: max-w 1240px, padding lateral 20px → 32px (≥768px).

### Fontes

| Papel | Pacote | Uso |
|---|---|---|
| Display | `@fontsource-variable/saira` (eixos `wght` e `wdth`; usar `font-stretch: 75%` para o condensado). Se o pacote não tiver `wdth`, usar `@fontsource/saira-condensed` e registrar no relatório | h1, h2, "12", posições |
| Texto | `@fontsource/titillium-web` (400, 600, 700) | parágrafos, botões |
| Dados | `@fontsource-variable/jetbrains-mono` | eyebrows, tags de stack, tempos, telemetria. Sempre `tabular-nums` |

**Proibido:** Inter, Roboto, Arial como fonte visível, e qualquer fonte oficial da F1.

### Regras

- **Tipografia:** h1 `clamp(3rem, 10vw, 8.5rem)`, display condensado, maiúsculas, `leading-[0.9]`. h2 `clamp(2.25rem, 5vw, 4rem)`. Eyebrow em mono 12px, maiúsculas, `tracking-[0.2em]`, `silver-500`. Texto 16–18px, `leading-relaxed`, máx. 65ch.
- **Cor:** teal em no máximo **um CTA + dados ao vivo por viewport**. Vermelho só na intro. Nada de gradiente roxo/azul, glassmorphism genérico ou card dentro de card.
- **Contraste:** WCAG AA em tudo. Texto secundário mínimo `silver-500` sobre `carbon-950`. Botão teal usa texto `carbon-950`.
- **Ritmo de fundos:** carbon-950 → carbon-900 → carbon-950 alternando. Painéis em graphite-800 com borda `line`.
- **Detalhes de pista:** linhas finas de 1px, marcações de setor (S1/S2/S3), numeração mono, faixa quadriculada só no footer.
- **Layout:** mobile-first, testado em 360, 390, 768, 1024, 1280 e 1440px.

## 5. Estrutura da página

Ordem fixa. Cada seção é um componente em `src/sections/`, com `id` igual à âncora.

| # | id | Componente | Fundo | Conteúdo (`site.ts`) | CTA |
|---|---|---|---|---|---|
| — | — | `StartLights` (overlay) | carbon-950 | `intro` | "Pular largada" |
| — | — | `SkipLink` | — | `ui.skipLink` | — |
| 0 | — | `TimingTower` (header) | transparente → carbon-950/90 com blur | `nav`, `profile` | "Chamar o box" (pequeno) |
| 1 | `grid` | `Hero` | carbon-950 + `.carbon` | `profile`, `hero` | primário WhatsApp + secundário `#classificacao` |
| 2 | `radio` | `TeamRadio` | carbon-900 (faixa) | `teamRadio` | — |
| 3 | `classificacao` | `Classification` | carbon-950 | `projects` | linha → rola até o case |
| 4 | `telemetria` | `Telemetry` (4 × `ProjectCase`) | carbon-900 | `projects` | "Ver código" / "Ver ao vivo" |
| 5 | `setup` | `CarSetup` | carbon-950 | `stack` | — |
| 6 | `piloto` | `DriverCard` | carbon-900 | `profile`, `about` | — |
| 7 | `box` | `Contact` | carbon-950 + `.carbon` | `contact`, `contactSection` | WhatsApp, copiar e-mail, GitHub, LinkedIn |
| 8 | — | `Footer` | carbon-950 + faixa quadriculada | `footer` | "Pausar animações" |
| — | — | `TrackMap` (fixo, ≥1280px) | — | `trackMap` | — |
| — | — | `ContactDock` (fixo, <1024px) | — | `contact` | WhatsApp + e-mail |

### Detalhamento

**StartLights (intro):** ver §7.2.

**TimingTower (header):**
- À esquerda: monograma em texto "DC" + "#12" em mono (sem logo, sem imagem).
- No centro (≥1024px): links do `nav` com prefixo de posição em mono ("P1 Grid", "P2 Classificação"...). O link ativo segue a seção visível (ScrollTrigger) e ganha um traço teal embaixo.
- À direita: indicador "ao vivo" (ponto teal pulsando) + botão pequeno "Chamar o box".
- Some ao rolar para baixo e volta ao rolar para cima (`yPercent`), sempre visível com foco dentro dele.
- No mobile: botão de menu abre `Sheet` (shadcn) com os mesmos links. Fecha com Esc, foco preso enquanto aberto, `aria-expanded`.

**Hero (`#grid`):**
- Eyebrow mono: `hero.eyebrow` ("PILOTO #12 · FULL-STACK").
- `<h1>` com `profile.name` ("DAVI CURTY"), display condensado, `.text-silver`. **Único h1 da página.**
- Logo abaixo: `profile.role` e o `profile.pitch` (frase de uma linha).
- Chips: cidade (`profile.city`), disponibilidade (`profile.availability`, com ponto teal) e "Remoto" se `profile.remote`.
- CTAs: primário `MagneticButton` teal "Chamar o box" (WhatsApp, `origem: "hero"`) e secundário ghost "Ver classificação" (âncora).
- Fundo: "12" gigante em contorno prata (`-webkit-text-stroke` 1px, sem preenchimento), deslocado à direita, `aria-hidden`. `SpeedLines` sutis atrás (só desktop).
- Rodapé do hero: `hero.scrollCue` em mono com seta animada.
- Mobile: tudo em 1 coluna, "12" atrás do nome com opacidade menor, sem SpeedLines.

**TeamRadio (`#radio`):** faixa estreita estilo rádio de equipe. Ícone de rádio + `teamRadio.label` em mono + ondas de áudio em CSS (barras com `scaleY` em loop leve) + `teamRadio.message` revelada com `ScrambleText` ao entrar na viewport. É a seção "agora" (no que o Davi está trabalhando). Não está no menu.

**Classification (`#classificacao`):**
- `SectionHeader` com `classification.eyebrow`, `classification.title` e `classification.subtitle`.
- Desktop (≥768px): tabela real (`<table>`) estilo placar de cronometragem. Colunas: `POS` (P1–P4) · `PROJETO` (nome + categoria) · `STATUS` (`StatusPill`) · `TEMPO` (a métrica de destaque do projeto, `project.headline`) · seta.
- Linha inteira clicável (link para `#caso-<slug>`), com foco visível.
- Hover (só `pointer: fine`): prévia da capa do projeto segue o cursor (`gsap.quickTo`), hoje `ImagePlaceholder`.
- Entrada: linhas aparecem em stagger como placar virando (y + opacity, 0.06s entre linhas). Os números de posição fazem `ScrambleText` curto.
- Mobile: lista de cards empilhados com a mesma informação.

**Telemetry (`#telemetria`):** um `ProjectCase` por projeto, na ordem P1 → P4, cada um com `id="caso-<slug>"`. Estrutura na §6.

**CarSetup (`#setup`):**
- `SectionHeader` com `stackSection`.
- 4 painéis (grid 1 → 2 → 4 colunas): **Motor** (back-end), **Aerodinâmica** (front-end), **Estratégia** (IA e automação), **Box** (infra e qualidade). Cada um com código mono ("PU-01", "AE-02"...), nome, descrição curta e tecnologias em `Badge`.
- Hover com `SpotlightCard` (brilho teal radial seguindo o mouse, só `pointer: fine`).
- Sem barras de "% de domínio". Sem logos de tecnologias.

**DriverCard (`#piloto`):**
- Card de piloto em 2 colunas (≥1024px): à esquerda a foto (`ImagePlaceholder` 4:5 até a foto chegar) com reveal em `clip-path` de baixo para cima; à direita "12" grande em `.text-silver`, nome, `profile.role`, ficha em mono (`about.facts`: Base, Nacionalidade, Temporadas, Especialidade) e os parágrafos de `about.paragraphs`.
- Fatos com valor `TODO_DAVI` não aparecem na tela (mas ficam no relatório).

**Contact (`#box`):**
- Título grande `contactSection.title` ("Chamar o box") + `contactSection.subtitle`.
- Botões: WhatsApp (primário teal, `MagneticButton`, `origem: "box"`), e-mail com botão "Copiar" (clipboard + toast `sonner` com `ui.emailCopied`, `origem: "box"`), GitHub e LinkedIn (ghost, `target="_blank" rel="noopener"`).
- Se `contact.cvUrl` existir, botão "Baixar currículo".
- Links com valor `TODO_DAVI` não renderizam.

**Footer:**
- Faixa quadriculada em CSS (`conic-gradient`) no topo do footer, 12px de altura.
- `footer.folio` ("Folio 2026"), `footer.credit`, `footer.disclaimer`, `© {ano} Davi Curty`.
- `MotionToggle` ("Pausar animações"/"Retomar animações").
- Links de contato repetidos em texto.

**TrackMap (≥1280px, decorativo):** ver §7.4. `aria-hidden="true"`.

**ContactDock (<1024px):** barra flutuante inferior (pill) com dois botões: WhatsApp e e-mail (copiar). Aparece com scale-in depois que o hero sai da tela, some dentro de `#box`. Respeita `env(safe-area-inset-bottom)`. Alvos ≥ 44px.

**SkipLink:** "Pular para o conteúdo" → `#conteudo` (o `<main>`), visível no foco.

## 6. Projetos (Classificação e Telemetria)

Ordem fixa: **P1 Mariana · P2 Doctor Genesis · P3 RGóis Odontologia · P4 BabelCall**. Todo o conteúdo está em `projects` de `site.ts`.

### Estrutura do `ProjectCase`

- **Cabeçalho:** `PositionBadge` ("P1"), nome em display, `tagline`, `category` em mono, `StatusPill`.
- **Corpo (2 colunas ≥1024px):**
  - Esquerda: blocos "Problema" e "Solução" (parágrafos) e "Destaques" (lista com marcador de setor em teal, 3–5 itens).
  - Direita: painel `.chamfer` de **telemetria** com cada item de `telemetry` como `CountUp` grande (mono) + rótulo + `TelemetryBar` (barra horizontal que preenche com `scaleX` proporcional ao maior valor daquele projeto). Se `telemetry` estiver vazio, o painel mostra `ui.telemetryPending`.
- **Stack:** lista de `Badge` mono.
- **Links:** "Ver código" (`links.repo`) e "Ver ao vivo" (`links.live`). Link com `TODO_DAVI` ou `null` não renderiza. Disparam `project_link`.
- **Galeria:** `images` (capa 16:10 + até 2 imagens). Hoje todas `ImagePlaceholder` com o nome do projeto.
- **Aviso:** se `disclaimer` existir, aparece em callout com ícone de alerta logo abaixo da solução (obrigatório no Doctor Genesis).
- **Status `"Treino livre"`** (BabelCall): o cabeçalho mostra `ui.inProgressNote` e o texto nunca afirma que a tradução já funciona em produção.

### `StatusPill`

| Status | Visual |
|---|---|
| `Em produção` | ponto teal pulsando + texto |
| `Entregue` | ponto prata fixo |
| `Treino livre` | ponto âmbar `#F5A524`, texto "Treino livre" |

## 7. Movimento

### 7.1 Personalidade

**Premium** de base (preciso, sem exagero) com picos **Energetic** na largada e nas microinterações.

| Tipo | Duração | Ease |
|---|---|---|
| Microinteração (hover, foco, toque) | 0.15–0.25s | `power2.out` |
| Reveal de conteúdo | 0.6–0.9s | `expo.out` |
| Entrada de título (linhas) | 0.8–1.0s, stagger 0.08 | `expo.out` |
| Overlay/saída de tela cheia | 0.7–0.9s | `power4.inOut` |
| Stagger de listas | 0.05–0.08s | — |

### 7.2 Intro de largada (`StartLights`)

Overlay fixo de tela cheia (z acima de tudo), fundo carbon-950 + `.carbon`.

1. **t = 0:** aparecem `intro.gridLabel` ("GRID · P1") no canto superior esquerdo, o painel de **5 luzes** no centro (5 colunas, cada uma com 2 círculos escuros dentro de uma caixa graphite) e "#12" abaixo. Botão `ui.skipIntro` visível no canto inferior direito desde o início.
2. **Acendem:** uma coluna por vez, a cada **0.35s** (5 × 0.35s). Cada luz liga trocando a opacidade de uma camada vermelha + glow (camada com `opacity`, sem animar `box-shadow`).
3. **Espera:** 0.3–0.6s (aleatório).
4. **Apagam:** todas juntas, instantâneo.
5. **Arrancada:** `SpeedLines` cruzam a tela (0.35s), o overlay sai com `clip-path` de baixo para cima (0.8s `power4.inOut`) e a timeline de entrada do hero começa.
6. **Total ≤ 3.2s.**

Regras:
- Roda **só na primeira visita da sessão** (`sessionStorage["dc:intro-seen"]`, sempre em `try/catch`; se falhar, não roda).
- Não roda com `prefers-reduced-motion: reduce` nem com movimento pausado (§7.5).
- "Pular largada" e a tecla **Esc** encerram na hora (`timeline.progress(1)`) e disparam `intro_skip`.
- Durante a intro: Lenis parado, `<main>` com `inert`. Ao terminar: libera tudo e manda o foco para o `<main>` sem rolar.
- O hero já está renderizado por baixo. O `<h1>` **não** começa com `opacity: 0` no CSS (protege o LCP).
- Sem som.

### 7.3 Entrada do hero

Depois da intro (ou direto, se ela não rodar): eyebrow → h1 em linhas (`SplitText` com máscara, `yPercent`) → role/pitch → chips → CTAs → "12" de fundo desliza `x` levemente → scroll cue. Total ≤ 1.4s.

### 7.4 TrackMap e SpeedLines

- **TrackMap** (≥1280px): SVG de ~120×200px fixo na lateral direita, centralizado na vertical. Traçado **fictício** desenhado do zero (curvas suaves, uma reta longa, um "S"). Linha do traçado em `line`, parte já percorrida em teal (`DrawSVGPlugin` com `scrub`), e um ponto (o carro) seguindo o traçado com `MotionPathPlugin`, ligado ao progresso do scroll da página inteira. Marcadores de setor S1/S2/S3 em mono nos pontos que correspondem a `#classificacao`, `#setup` e `#box`.
- **SpeedLines:** 6–10 linhas horizontais finas (`scaleX` + `x`), prata com opacidade baixa. Usadas na intro e no fundo do hero (desktop).
- Ambos `aria-hidden="true"` e desligados abaixo de 1280px (TrackMap) / 1024px (SpeedLines no hero).

### 7.5 Movimento reduzido e botão de pausa

`src/lib/motion.tsx` expõe `MotionProvider` + `useMotion()` com `{ allowed: boolean, paused: boolean, toggle() }`:
- `allowed = !prefersReducedMotion && !paused`.
- `paused` vem do `MotionToggle` e é salvo em `localStorage["dc:motion"]` (com `try/catch`).
- Ao pausar: animações em andamento vão para o estado final (`progress(1)`), loops param (rádio, pulsos, preview), Lenis é destruído, e o `<html>` recebe `data-motion="off"`. Reveals futuros mostram o conteúdo sem animar.
- O CSS garante: `html[data-motion="off"] [data-reveal]` e `@media (prefers-reduced-motion: reduce) [data-reveal]` sempre visíveis.

### 7.6 Regras de implementação (GSAP)

- Registrar todos os plugins **uma vez** em `src/lib/gsap.ts` e importar `gsap` sempre de lá.
- `useGSAP(() => {...}, { scope, dependencies })` em todo componente animado. Nunca seletor sem escopo. Nada de `useEffect` com gsap solto.
- `gsap.matchMedia()` para separar desktop/mobile e `(prefers-reduced-motion: reduce)`. Além disso, checar `useMotion().allowed`.
- Animar só `transform` (`x`, `y`, `xPercent`, `yPercent`, `scale`, `scaleX`, `scaleY`, `rotation`) e `opacity`/`autoAlpha`. **Exceções permitidas:** `clip-path` (saída da intro e reveal da foto do piloto), `strokeDashoffset`/DrawSVG (TrackMap) e o texto do `ScrambleText`. Nenhuma outra.
- Sequências com `gsap.timeline()` e parâmetro de posição. Nada de `delay` empilhado.
- Lenis + ScrollTrigger: `lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker`. Âncoras rolam via Lenis com offset da altura do header.
- `ScrollTrigger.refresh()` depois de `document.fonts.ready` e do carregamento das imagens.
- O conteúdo precisa ser legível se o JS falhar: classe `js` no `<html>` (script inline) esconde `[data-reveal]` só quando há JS.

## 8. Componentes (`src/components/`)

| Componente | Descrição | Movimento reduzido/pausado | Origem |
|---|---|---|---|
| `Reveal` | Wrapper: fade + y 24px ao entrar (`start: "top 85%"`, `once`). Props `delay`, `stagger` | sem animação | adaptar do RGóis |
| `SplitHeading` | Título com `SplitText` (linhas com máscara, `yPercent`) | texto estático | adaptar do RGóis |
| `CountUp` | Conta de 0 ao valor ao entrar. `prefix`, `suffix`, `decimals`, formato pt-BR, `tabular-nums` | valor final | adaptar do RGóis |
| `MagneticButton` | Puxa levemente em direção ao cursor (`gsap.quickTo`). Só `pointer: fine` | botão normal | adaptar do RGóis |
| `SpotlightCard` | Brilho radial teal seguindo o mouse (CSS vars `--x/--y`). Só `pointer: fine` | sem efeito | adaptar do RGóis |
| `SectionHeader` | eyebrow mono + h2 (`SplitHeading`) + subtítulo opcional | — | adaptar do RGóis |
| `PitButton` | `<a>` do WhatsApp com `whatsappLink()`, `track("cta_whatsapp", { origem })` (prop `origem` obrigatória), variantes `primary` (teal), `ghost`, `small`. Efeito "DRS": no hover, uma aba interna desliza (`xPercent`) e a seta avança | sem deslocamento | novo (base `WhatsAppButton` do RGóis) |
| `CopyEmailButton` | Copia `contact.email`, toast `sonner`, `track("copy_email", { origem })`. Fallback `mailto:` se o clipboard falhar | — | novo |
| `StatusPill` | Ver §6 | pulso parado | novo |
| `PositionBadge` | "P1"…"P4" em display condensado, caixa graphite com borda teal à esquerda | — | novo |
| `TelemetryBar` | Barra que preenche com `scaleX` (origem à esquerda) ao entrar | já preenchida | novo |
| `ImagePlaceholder` | Bloco graphite + `.carbon` + "12" pequeno + `label` + `ui.imageSoon`. Props `ratio` (`16/10`, `4/5`, `1/1`) e `label`. `role="img"` com `aria-label` | — | novo |
| `SpeedLines` | Ver §7.4 | não renderiza | novo |
| `TrackMap` | Ver §7.4 | não renderiza | novo |
| `StartLights` | Ver §7.2 | não renderiza | novo |
| `MotionToggle` | Botão que alterna `useMotion().toggle()`, `aria-pressed`, `track("motion_toggle")` | — | novo |
| `ContactDock` | Ver §5 | aparece sem animação | novo |
| `SkipLink` | Ver §5 | — | novo |
| `CarbonBg` | Overlay `.carbon` posicionado (substitui o `Grain` do RGóis) | — | adaptar do RGóis (`Grain`) |
| `ui/*` | shadcn: `button`, `badge`, `tooltip`, `sheet`, `sonner`, restilizados com os tokens | — | shadcn |

## 9. Assets

As imagens dos projetos e a foto do Davi **ainda não existem**. Todos os lugares de imagem usam `ImagePlaceholder` e os caminhos abaixo já ficam previstos em `site.ts` como `null`.

| Arquivo (futuro) | Uso | Status |
|---|---|---|
| `public/images/projects/<slug>-cover.webp` | capa 16:10 do case e prévia da Classificação | **pendente** |
| `public/images/projects/<slug>-1.webp`, `-2.webp` | galeria do case | **pendente** |
| `public/images/davi.webp` | foto do card de piloto (4:5) | **pendente** |
| `public/favicon.svg` | "12" em display condensado prata sobre carbon, com traço teal | gerar na Fase 3 |
| `public/og.png` (1200×630) | carbon + "12" grande prata + "DAVI CURTY" + "Desenvolvedor Full-stack" + linha teal | gerar na Fase 3 |
| `public/cv.pdf` | currículo | opcional (`contact.cvUrl`) |

Quando as imagens chegarem: AVIF/WebP, `width`/`height` definidos, `srcset` 640/960/1440, ≤ 200KB cada, `loading="lazy"` + `decoding="async"` (exceto o que for LCP).

**Proibido:** banco de imagens, imagens geradas por IA, fotos de carros/pilotos/equipes reais.

## 10. SEO e metadados

- `index.html`: `lang="pt-BR"`, `theme-color` `#0A0A0B`, `<title>` e `meta description` de `seo`, Open Graph e Twitter card (`og.png`), favicon SVG.
- Injetados no build por um plugin `transformIndexHtml` em `vite.config.ts` que importa `site.ts` (fonte única).
- **JSON-LD** `Person` (gerado pelo mesmo plugin): `name`, `jobTitle`, `url`, `image` (quando houver), `sameAs` (GitHub, LinkedIn), `knowsAbout` (tecnologias de `stack`), `address.addressLocality` (se `profile.city` não for `TODO_DAVI`).
- Enquanto `seo.siteUrl` for `TODO_DOMINIO`, o plugin **omite** canonical, `og:url`, `og:image` absoluto e `url` do JSON-LD. `sitemap.xml` só é publicado com domínio definido.
- `public/robots.txt` estático.
- Um único `<h1>` (hero). Um `<h2>` por seção. Cases com `<h3>`.
- Nenhum texto dentro de imagem.

## 11. Performance e acessibilidade (critérios de aceite)

- Lighthouse mobile: **Performance ≥ 90, Acessibilidade ≥ 95, Boas práticas ≥ 95, SEO = 100**.
- **LCP < 2,5s** (4G), **CLS < 0,1**, **INP < 200ms**.
- Bundle JS inicial **< 200KB gz**. `StartLights`, `TrackMap` e `SpeedLines` carregam com `React.lazy` + `Suspense` (fallback `null`).
- Fontes: preload só do peso display usado no h1. `font-display: swap`.
- Sem scroll horizontal em 360px. Alvos de toque ≥ 44px.
- Teclado: tab por toda a página, `Sheet` do menu, linhas da tabela, botões de copiar, skip link. `:focus-visible` com anel teal de 2px + offset 2px.
- Landmarks: `header`, `nav`, `main#conteudo`, `footer`. Seções com `aria-labelledby`.
- `prefers-reduced-motion` e o `MotionToggle` respeitados em **todos** os componentes animados.
- Elementos decorativos (`TrackMap`, `SpeedLines`, "12" de fundo, ondas do rádio) com `aria-hidden="true"`.

## 12. Fora do escopo da v1

Versão em inglês · som de motor · blog · CMS · WebGL/3D · páginas por projeto (rotas) · formulário de contato com backend · tema claro · outros projetos além dos 4 da §6.

## 13. Pendências (rastreadas no código como `TODO_DAVI`)

1. Frase do hero (`profile.pitch`): hoje é texto provisório
2. Cidade e se aceita projetos remotos
3. Anos de experiência (`profile.yearsExperience`)
4. Parágrafos do "Sobre" (`about.paragraphs`)
5. WhatsApp, e-mail e LinkedIn
6. URLs ao vivo de Mariana, Doctor Genesis e BabelCall
7. Status real da Mariana (hoje "Em produção") e mensagem do rádio (hoje BabelCall)
8. Stack do "Setup do carro": confirmar os grupos (hoje montados a partir dos repositórios)
9. Imagens dos 4 projetos e foto do Davi
10. Domínio (`seo.siteUrl`)
11. Currículo em PDF (opcional)
12. Decisão: repositório da Mariana continua público? (o código cita o cliente)

Ao terminar, rodar `grep -rn "TODO" src index.html vite.config.ts` e listar o resultado no relatório final.

## 14. Estrutura de pastas

```
davicurty-portfolio/
├─ AGENTS.md · CLAUDE.md
├─ docs/  SPEC.md · PLAN.md · QA-REPORT.md (Fase 4)
├─ index.html
├─ public/  favicon.svg · og.png · robots.txt · images/ (futuro)
└─ src/
   ├─ main.tsx · App.tsx
   ├─ content/site.ts          ← fonte única de conteúdo, inclusive strings de UI (`ui`)
   ├─ lib/  gsap.ts · lenis.ts · motion.tsx · track.ts · utils.ts · useReducedMotion.ts
   ├─ components/
   │  ├─ ui/        (shadcn)
   │  ├─ motion/    Reveal · SplitHeading · CountUp · MagneticButton · SpotlightCard ·
   │  │             SpeedLines · TrackMap · StartLights · TelemetryBar · CarbonBg
   │  └─ common/    SectionHeader · PitButton · CopyEmailButton · StatusPill ·
   │                PositionBadge · ImagePlaceholder · MotionToggle · ContactDock · SkipLink
   ├─ sections/  TimingTower · Hero · TeamRadio · Classification · Telemetry ·
   │             ProjectCase · CarSetup · DriverCard · Contact · Footer
   └─ styles/index.css         ← @import "tailwindcss"; @theme {...}; base; utilitários
```
