# QA-REPORT: Fase 4 (WP-4)

> Auditoria feita por um agente que não escreveu o código. **Nada foi corrigido** (regra do PLAN).
> Data: 2026-11-11 · Commit auditado: `ad9a5e1` (árvore limpa) · Build de produção servido por `vite preview` em `http://localhost:4173/`.
> Screenshots em `docs/qa/` (53 arquivos). Scripts de teste ficaram no scratchpad da sessão (fora do projeto).

## 1. Resumo

**Veredito geral: REPROVADO (por pouco).** A base está sólida: build e lint limpos, bundle dentro do orçamento, intro, movimento reduzido e botão de pausa funcionando de ponta a ponta, sem scroll horizontal, contraste dos tokens AA. Reprovam dois itens de acessibilidade com correção pequena:

1. **Teclado:** as linhas da Classificação (tabela no desktop e cards no mobile) ficam **fora da ordem de Tab** até a seção rolar para a viewport, porque a entrada usa `autoAlpha` (vira `visibility: hidden`). Quem navega só por teclado pula direto do hero para "Ver código" do primeiro case.
2. **Contraste (axe):** 1 regra `serious` (5 nós): o "12" decorativo do `ImagePlaceholder` tem 2,91:1.

Além disso há um defeito visual relevante (TrackMap sobrepõe conteúdo em 1280px) e um clique morto na seta da tabela, registrados como achados.

| Resultado | Itens do checklist |
|---|---|
| Aprovado | 9 |
| Reprovado | 2 |
| N/A (SEO adiado / não testável) | 2 + 1 parcial |
| Pendente do Davi | 1 (grep pelo nome real do cliente) |

Números principais: bundle JS inicial **184,64 KB gz** (< 200). Lighthouse mobile **Performance 94 · Acessibilidade 98 · Boas práticas 96** (SEO não medido: adiado). LCP 0,8 s · CLS 0,038 · TBT 290 ms.

---

## 2. Checklist da Fase 4

| # | Item | Resultado | Evidência |
|---|---|---|---|
| 1 | Textos batem com `site.ts`, nada inventado | **Aprovado** | Texto renderizado (`document.body.innerText`) comparado com `src/content/site.ts`: todas as strings vêm de `profile`, `hero`, `teamRadio`, `classification`, `projects`, `stackSection`, `stack`, `about`, `contactSection`, `footer`, `ui`. Valores `TODO_DAVI` não aparecem (`innerText.includes("TODO") === false`). Rótulos gerados no código são só numeração (`P1`…`P4`, `S1`…`S5`, `© {ano}`). |
| 2 | Nenhuma menção ao cliente da Mariana | **Aprovado (parcial) / pendente do Davi** | Os textos usam "administradora de consórcio" (`site.ts:113`; comentário `site.ts:8`). Não há nome próprio de cliente em `projects[0]`, alts (`aria-label` dos placeholders = "Mariana · Imagem em breve") nem nomes de arquivo. **O QA não conhece o nome real e não o procurou.** Davi precisa rodar: `grep -rni "<nome real>" src index.html public docs vite.config.ts` (e no `dist/` após o build). Atenção ao item 12 da SPEC §13: o link `links.repo` aponta para `github.com/DaviC18/Mariana-Core`, e a SPEC registra que esse repositório cita o cliente. |
| 3 | Nenhuma marca proibida | **Aprovado** | `grep -rniE "mercedes\|amg\|petronas\|formula ?1" src index.html public` → 1 ocorrência: `src/content/site.ts:343` (`footer.disclaimer`, exceção permitida). `public/` não existe ainda. Traçado do TrackMap é fictício (`TrackMap.tsx:11-12`). |
| 4 | Intro: 1×/sessão, Pular e Esc, não roda com reduced/pausado, foco no main, ≤ 3,2 s | **Aprovado** | Overlay visível de 427 ms a 3421 ms após a navegação = **2,99 s** de intro (timeline: 0,2 + 4×0,35 + 0,3–0,6 + 0,2 + 0,8 = 2,9–3,2 s). Antes disso ~0,4 s de véu carbon enquanto o chunk lazy carrega. Recarregar na mesma sessão: sem intro. "Pular largada": fecha em 69 ms; Esc: 27 ms. Depois: `#conteudo` sem `inert`, `document.activeElement.id === "conteudo"`, `scrollY = 0`. Reduced e pausado: intro não renderiza e `main` não fica `inert`. Prints: `1280-intro-lights.png`, `1280-intro-lights-2.png`, `1280-intro-after.png`. Ressalva: ver achado A3 (Tab escapa para o header durante a intro). |
| 5 | CTAs de WhatsApp abrem `wa.me` com mensagem e `origem`; copiar e-mail mostra toast | **N/A: não testável no build até preencher contato** (código verificado) | No build, `a[href*="wa.me"]` = 0 e botões "Copiar e-mail" = 0 em todas as larguras (esperado: `contact.whatsapp`/`email` = `TODO_DAVI`). Código: `PitButton.tsx:73` usa `whatsappLink(message)` (`site.ts:326-327`, `wa.me/{número}?text=encodeURIComponent(mensagem)`); `track("cta_whatsapp", { origem })` em `PitButton.tsx:78` com `origem` obrigatória; usos: `hero` (`Hero.tsx:149`), `header` (`TimingTower.tsx:130`), `box` (`Contact.tsx:37`), `dock` (`ContactDock.tsx:68`); o link do rodapé dispara `track("cta_whatsapp", { origem: "footer" })` (`Footer.tsx:22`). Copiar e-mail: `CopyEmailButton.tsx:31-39` chama `track("copy_email", { origem })` + `toast.success(ui.emailCopied)`, com fallback `mailto:`. Toaster montado em `App.tsx:84`. Retestar depois de preencher os contatos. |
| 6 | Links `TODO_DAVI` não aparecem na tela | **Aprovado** | Build: sem WhatsApp, e-mail, LinkedIn, "Ver ao vivo", fato "Base"/"Temporadas" nem parágrafos do Sobre. Aparecem só os links reais (4× "Ver código", GitHub no Box e no rodapé). `ContactDock` não renderiza (`ContactDock.tsx:58-59`). Prints: `1440-box.png`, `1440-piloto.png`, `390-footer.png`. |
| 7 | Sem scroll horizontal em 360px e alvos ≥ 44px | **Aprovado** | `scrollWidth` = largura da viewport em 360, 390, 768, 1024, 1280 e 1440. Em 360 e 390, nenhum elemento interativo visível com lado < 44 px (único falso positivo: o skip link escondido, 1 px até receber foco). Sem elementos vazando à direita. Prints: `360-full.png`, `390-full.png`. |
| 8 | Teclado: Tab pela página, Sheet, linhas da tabela, skip link, foco visível | **Reprovado** | OK: 1º Tab foca o skip link visível (`1280-skiplink-focus.png`), Enter leva o foco para `#conteudo`. Anel teal de 2 px em todos os focáveis. Sheet: `aria-expanded` false→true, foco entra no 1º link, Tab circula só dentro do diálogo (P1…P5 → Fechar → P1), Esc fecha e devolve o foco ao botão de menu (`390-menu-open.png`). Clicar um link do menu fecha o Sheet e manda o foco para a seção (`#setup`), não para o botão: a nota do desenvolvedor não se confirmou. Linha da tabela focada mostra contorno na linha inteira (`1280-classificacao-row-focus.png`). **Falha:** na 1ª passada de Tab (sem rolar antes), os 4 links da Classificação **não recebem foco** em 1280 e em 390: a ordem vai de "Ver classificação" direto para "Ver código" (Mariana). Causa: `Classification.tsx:34` anima as linhas com `autoAlpha: 0` (= `visibility: hidden`) até o ScrollTrigger `top 80%` disparar. Elementos com `visibility: hidden` não são focáveis. Só aparecem na 2ª volta do Tab. |
| 9 | Reduced-motion **e** MotionToggle: sem movimento, conteúdo visível, TrackMap/SpeedLines ausentes | **Aprovado** | Reduced (390 e 1440) e pausado (390 e 1440): `[data-reveal]` ocultos = 0 sem rolar, TrackMap ausente, SpeedLines = 0, Lenis desligado (`html` sem `.lenis`), `document.getAnimations()` rodando = 0. Pausado põe `data-motion="off"`. Toggle ao vivo em 1440: `aria-pressed` false→true, rótulo "Pausar"→"Retomar", TrackMap e SpeedLines somem, `localStorage["dc:motion"]="off"`, persiste após reload; retomar devolve TrackMap e mantém o conteúdo visível. Prints: `390-hero-reduced.png`, `1440-full-reduced.png`, `390-full-paused.png`, `1440-full-paused.png`, `1440-footer-paused-toggle.png`. |
| 10 | Lighthouse mobile nas metas da SPEC §11 + bundle | **Aprovado** (SEO: N/A) | Lighthouse 13.6.0, mobile, build local: **Performance 94** (≥ 90), **Acessibilidade 98** (≥ 95), **Boas práticas 96** (≥ 95), SEO não medido (adiado). FCP 0,8 s · **LCP 0,8 s** (< 2,5) · **CLS 0,038** (< 0,1) · TBT 290 ms · Speed Index 1,9 s · TTI 3,4 s · peso total 359 KiB. Bundle (`npm run build`): `index-*.js` **184,64 KB gz** (< 200); lazy: `TrackMap` 11,91 KB gz, `StartLights` 1,44 KB gz, `SpeedLines` 0,76 KB gz; CSS 14,19 KB gz. Auditorias que falharam: favicon 404 (esperado), `label-content-name-mismatch` (achado A6), `landmark-one-main` (o `main` estava `inert` porque a intro rodava na hora da coleta), JS não usado 66 KiB, CSS bloqueando render ~140 ms. INP não medível em teste de laboratório (TBT 290 ms e Max Potential FID 350 ms ficam como alerta). |
| 11 | JSON-LD `Person` válido | **N/A: SEO adiado** | Plugin de meta/JSON-LD ainda não existe (`vite.config.ts` sem `transformIndexHtml`; `dist/index.html` só com `<title>Davi Curty</title>`). |
| 12 | Contraste AA (axe sem erros sérios) | **Reprovado** | axe-core 4.10.2 injetado no teste (1440 e 390-reduced, tags WCAG 2.0/2.1/2.2 A/AA + best-practice): **1 violação `serious`, `color-contrast`, 5 nós**: o "12" de canto do `ImagePlaceholder` (`ImagePlaceholder.tsx:33`, `text-silver-500/60` = #5E6267 sobre #16171A = **2,91:1**). É decorativo e está com `aria-hidden`, mas o axe acusa mesmo assim. Nenhuma outra violação. Razões dos tokens (script Node): silver-500 sobre carbon-950 **6,46**, sobre carbon-900 6,12, sobre graphite-800 **5,85**, sobre graphite-700 5,20; carbon-950 sobre teal-400 **10,33**, sobre teal-600 6,20; âmbar sobre graphite-800 **8,78**, sobre carbon-900 9,18; teal-400 sobre carbon-950 10,33; base do gradiente `.text-silver` (#7D838A) sobre carbon-900 4,90. Todas ≥ 4,5. Borda `line` sobre carbon-950: 1,42 (ver achado A11). |
| 13 | Achados de `/critique`, `/audit` e `web-design-guidelines` classificados | **Aprovado** | Seção 3. |
| 14 | Lista de `TODO_DAVI` restantes | **Aprovado** | Seção 4. |

Também verificado:
- `npm run build`: passa (só o aviso padrão do Vite de chunk > 500 KB não comprimido). `npm run lint`: sem erros.
- Hierarquia: um único `h1` ("Davi Curty"); um `h2` por seção com `aria-labelledby` correto; cases com `h3` e blocos internos com `h4`. Landmarks: `header`, `nav`, `main#conteudo`, `footer`.
- GSAP é a única lib de animação (sem `framer-motion`/`motion`). Nenhum import direto de `"gsap"` fora de `src/lib/`.
- Console: sem erros de JS em nenhuma rodada; só o 404 do favicon (esperado).

---

## 3. Achados de design e técnica

Origem: `impeccable` (`/critique` e `/audit`, incluindo o detector `impeccable detect --json src index.html`), `web-design-guidelines` (regras do Vercel Web Interface Guidelines, baixadas em 2026-11-11) e inspeção dos screenshots.

> ⚠️ DEGRADED: single-context. O `/critique` pede dois sub-agentes isolados. Rodou numa sessão só, porque este agente não pode abrir sub-agentes sem pedido do Davi.

Classificação: **segue a SPEC** (o código já faz o que a SPEC manda, a skill discorda) · **diverge da SPEC (não aplicar)** (a sugestão contraria paleta, fontes, tema ou conteúdo) · **melhoria sugerida** (compatível com a SPEC, depende de aprovação).
Marque `[x]` no que aprovar para a Fase 5.

### 3.1 Notas do `/audit` (impeccable)

| Dimensão | Nota | Principal achado |
|---|---|---|
| Acessibilidade | 3 | Linhas da Classificação fora da ordem de Tab até rolar (A1) |
| Performance | 3 | Bundle no limite (184,6/200 KB gz), TBT 290 ms, sem preload da fonte do h1 |
| Theming | 4 | Tokens da SPEC em `@theme`, variáveis do shadcn apontando para eles |
| Responsivo | 3 | TrackMap sobre o conteúdo em 1280 px (A2), resto fluido de 360 a 1440 |
| Integridade de implementação | 3 | Detector: 3 achados, todos pedidos pela SPEC. Código coerente e específico do tema |
| **Total** | **16/20** | **Bom** |

Heurísticas de Nielsen (`/critique`, modo Experience): 1 Status 3 · 2 Mundo real 3 · 3 Controle 4 · 4 Consistência 3 · 5 Prevenção de erro 3 · 6 Reconhecimento 3 · 7 Flexibilidade n/a · 8 Estética 3 · 9 Recuperação de erro n/a · 10 Ajuda n/a → **22/28 (Bom)**.

Veredito de especificidade: o design é **autoral e específico do produto**. Classificação como placar, telemetria com `CountUp` e barras, luzes de largada, rádio do box e card de piloto não serviriam a outro portfólio sem reescrever. O ponto fraco hoje é a falta de conteúdo: sem contatos, foto e parágrafos do Sobre, o hero fica sem CTA primário, o Box mostra um botão só e o card de piloto é um placeholder grande com 2 fatos.

### 3.2 Acessibilidade e teclado

- [ ] **A1. Linhas da Classificação inalcançáveis por Tab antes de rolar** · *melhoria sugerida (corrige item reprovado)* · **alta**
  `Classification.tsx:34`: trocar `autoAlpha` por `opacity` na entrada das linhas (como o `Reveal` já faz), ou não esconder antes do trigger. Afeta tabela (≥768) e cards (<768). Evidência: ordem de Tab em 1280 e 390 (item 8).
- [ ] **A2. Contraste do "12" do `ImagePlaceholder` (axe serious)** · *melhoria sugerida (corrige item reprovado)* · **média**
  `ImagePlaceholder.tsx:33`: `text-silver-500/60` (2,91:1). Usar `text-silver-500` cheio (5,85:1) ou outro token que passe. A paleta não muda.
- [ ] **A3. Durante a intro, Tab sai do overlay** · *melhoria sugerida* · **média**
  O foco começa em "Pular largada", mas o 1º Tab vai para o logo do header, que está atrás do overlay (só o `<main>` fica `inert`, `StartLights.tsx:52`). Sugestão: deixar header e skip link `inert` também durante a intro. A SPEC §7.2 cita só o `<main>`, então isso estende a SPEC sem contrariá-la.
- [ ] **A4. Clique morto na seta da tabela** · *melhoria sugerida* · **média**
  No hover, o ícone `ArrowRight` (`Classification.tsx:149-153`) ganha `translate-x-1` e passa a ficar acima do `::after` que cobre a linha. Clicar exatamente na seta não navega (o alvo do clique é o `<path>` do SVG; o hash não muda). Clicar no resto da linha funciona. Sugestão: `pointer-events-none` no ícone.
- [ ] **A5. `nav` sem `aria-label`** · *melhoria sugerida (precisa de texto novo em `site.ts`)* · **baixa**
  Há duas `<nav>` (desktop `TimingTower.tsx:118` e Sheet `:143`), ambas sem rótulo. Criar `ui.navLabel` em `site.ts` (ex.: "Navegação principal"; o texto é decisão do Davi).
- [ ] **A6. Nome acessível do logo diferente do texto visível** · *melhoria sugerida* · **baixa**
  `TimingTower.tsx:113`: `aria-label="Davi Curty"` sobre o texto visível "DC #12" (Lighthouse `label-content-name-mismatch`, WCAG 2.5.3). Sugestão: rótulo que contenha o texto visível, ou remover o `aria-label` e pôr o nome em `sr-only`.
- [ ] **A7. `MotionToggle` com `aria-pressed` e rótulo que muda** · *segue a SPEC* (SPEC §5 pede os dois rótulos e §8 pede `aria-pressed`) · **baixa**
  O leitor de tela anuncia "Retomar animações, pressionado", que é ambíguo. Padrão recomendado: rótulo fixo ("Pausar animações") + `aria-pressed`, ou rótulo variável sem `aria-pressed`. Só aplicar se o Davi quiser flexibilizar a SPEC.
- [ ] **A8. Célula vazia `<td>` no `<thead>`** · *melhoria sugerida* · **baixa**
  `Classification.tsx:110`: a coluna da seta usa `<td>` dentro da linha de cabeçalho. Usar `<th>` com `aria-hidden` ou um rótulo `sr-only`.
- [ ] **A9. Header fixo pode cobrir o elemento focado ao voltar com Shift+Tab** · *melhoria sugerida* · **baixa**
  Não há `scroll-padding-top` no `html`. Ao rolar para cima o header reaparece (64 px) e pode cobrir o foco no topo (WCAG 2.4.11). Sugestão: `scroll-padding-top` igual à altura do header. Não foi reproduzido em teste; é risco apontado pela revisão de código.
- [ ] **A10. `landmark-one-main` no Lighthouse** · *segue a SPEC* · **baixa**
  Durante a intro o `main` fica `inert` (SPEC §7.2) e some da árvore de acessibilidade. O Lighthouse coletou nesse momento. Comportamento correto; só registro.
- [ ] **A11. Bordas `line` com 1,42:1 de contraste** · *diverge da SPEC (não aplicar)* · **baixa**
  Os botões ghost (`border-line`) ficam abaixo do 3:1 de contraste não textual (WCAG 1.4.11). O rótulo de texto identifica o botão, então não é falha formal. Mudar o token contraria a paleta da SPEC §4.

### 3.3 Layout, responsivo e visual

- [ ] **B1. TrackMap sobre o conteúdo em 1280 px** · *melhoria sugerida* · **alta**
  Em 1280 o mapa (x 1136–1256) cobre a coluna "TEMPO" e as setas da tabela (`1280-classificacao-row-focus.png`), o canto do painel "Box" do Setup ("INFRA E QUALIDADE", `1280-trackmap-mid.png`) e o painel de telemetria. Em 1440 sobra só ~12 px de sobreposição na borda do conteúdo. Sugestão: mostrar o TrackMap só a partir de uma largura com calha livre (ex.: ≥1400 px), ou reduzir o `max-width` do container quando ele estiver ativo. A SPEC diz "≥1280px": mudar o breakpoint é decisão do Davi.
- [ ] **B2. TrackMap sobre o "12" do hero** (nota do desenvolvedor, confirmada) · *melhoria sugerida* · **média**
  Em 1280 e 1440 o traçado fica dentro do contorno do "12" (`1440-hero.png`, `1280-trackmap-hero.png`). As duas linhas finas competem. Opções: TrackMap aparecer só depois que o hero sai da tela (fade com `autoAlpha`), ou deslocar o "12" para a esquerda em ≥1280.
- [ ] **B3. SpeedLines passam por trás do texto e do botão do hero** · *melhoria sugerida* · **baixa**
  Linhas cruzam o parágrafo do pitch e o botão ghost "Ver classificação", que tem fundo transparente (`1280-trackmap-hero.png`, `1440-hero.png`). Sugestão: limitar as linhas à metade direita ou dar fundo `carbon-950` ao botão ghost.
- [ ] **B4. Galeria do case com 1/3 vazio em ≥1024** · *melhoria sugerida* · **baixa**
  Com `cover: null` e galeria vazia, cada case mostra 1 placeholder em `lg:col-span-2` num grid de 3 colunas (`ProjectCase.tsx:160-168`), e a coluna da direita fica vazia. Some quando as imagens chegarem; até lá, usar a largura total quando houver só 1 imagem.
- [ ] **B5. Ficha do card de piloto quebra mal** · *melhoria sugerida* · **baixa**
  Em 1440 "Full-stack · IA · Automação" quebra em 2 linhas alinhadas à direita, ao lado de "Nacionalidade BRA" (`1440-piloto.png`). Com só 2 fatos (Base e Temporadas são `TODO_DAVI`), 1 coluna fica melhor.
- [ ] **B6. "12" e "Piloto #12" lado a lado** · *segue a SPEC* · **baixa**
  A SPEC §5 pede "12" grande + nome. O título `about.title` ("Piloto #12") repete o número logo ao lado. Se o Davi quiser, troca de texto em `site.ts` (decisão de conteúdo, não do QA).
- [ ] **B7. Seção `#telemetria` com título genérico** (nota do desenvolvedor) · *melhoria sugerida (precisa de texto novo em `site.ts`)* · **baixa**
  O `h2` usa `ui.telemetry` ("Telemetria"), a mesma string do rótulo `h4` de cada painel, e não tem eyebrow nem subtítulo, ao contrário das outras seções. Sugestão: criar `telemetrySection { eyebrow, title, subtitle }` em `site.ts`.

### 3.4 Movimento

- [ ] **C1. Seta do scroll cue com `animate-bounce`** · *melhoria sugerida* · **baixa**
  Detector: "bounce easing" (`Hero.tsx:167`). Fora da personalidade "Premium" da SPEC §7.1. Sugestão: loop leve de `y` com `sine.inOut` (GSAP, respeitando `allowed`) ou seta parada. A SPEC pede "seta animada", então a animação continua, só o easing muda.
- [ ] **C2. Kill global de 0,01 ms em reduced/pausado** · *segue a SPEC* · **baixa**
  `index.css:146-164` zera toda `transition`/`animation`. O `/audit` alerta que isso também remove feedback útil (hover de cor, Sheet). A SPEC §7.5 pede "nenhum movimento". Trocas de cor de hover poderiam ficar de fora do kill sem violar a SPEC, se o Davi quiser.
- [ ] **C3. Vários pontos teal pulsando no primeiro viewport** · *segue a SPEC* · **baixa**
  "Ao vivo" do header + chip "Disponível para projetos" pulsam juntos (dados ao vivo, permitidos pela §4). Na tela de case há bastante teal (borda do `PositionBadge`, marcadores S1–S5, borda do painel, barras), também todos pedidos pela SPEC. Só registro.

### 3.5 Dados e conteúdo

- [ ] **D1. Barras de telemetria comparam métricas de naturezas diferentes** · *segue a SPEC* (SPEC §6: escala pelo maior valor do projeto) · **média**
  Ex.: RGóis "Nota no Google 5,0" vira uma barra de 12% ao lado de "+40 anos", e parece nota baixa. Mariana: "3 integrações" vs "+100 arquivos de teste". Sugestão para o Davi avaliar: escala por métrica (ex.: nota sobre 5) ou barras só onde a comparação faz sentido. Muda a regra da SPEC.
- [ ] **D2. Site sem nenhum contato além do GitHub** · *segue a SPEC* (`TODO_DAVI` não renderiza) · **alta para o lançamento**
  No build: hero sem CTA primário, header sem "Chamar o box", Box só com GitHub, sem `ContactDock` no mobile. O objetivo da SPEC §2 (contato a um clique) só se cumpre depois de preencher `contact.whatsapp`, `contact.email` e `contact.linkedin`. Bloqueante para o deploy, não para a Fase 5.

### 3.6 Performance

- [ ] **E1. Sem preload da fonte display do h1** · *melhoria sugerida (a SPEC §11 pede)* · **média**
  `dist/index.html` não tem `<link rel="preload" as="font">`. A fonte do h1 é `saira-latin-wdth-normal-*.woff2` (98,9 KB). Como o nome tem hash, precisa vir do plugin da Fase 3 ou de um import `?url`.
- [ ] **E2. JS não usado e TBT** · *melhoria sugerida* · **baixa**
  Lighthouse: ~66 KiB de JS não usado no chunk inicial, TBT 290 ms. Candidatos: `ScrambleTextPlugin` (só TeamRadio e Classificação, abaixo da dobra) e `SplitText` fora do hero. O orçamento de 200 KB gz está a 15 KB do limite.
- [ ] **E3. Chunk `SpeedLines` baixado no mobile** · *melhoria sugerida* · **baixa**
  `Hero.tsx:86-90` monta `SpeedLines` sempre que `allowed`, e ele só fica escondido por CSS (`hidden lg:block`). São 0,76 KB gz e alguns nós no DOM. Condicionar a `MQ.desktop` como o App faz com o TrackMap.
- [ ] **E4. Registro de plugins GSAP dividido** (nota do desenvolvedor) · *diverge da SPEC* · **baixa (decisão do Davi)**
  `src/lib/gsap.ts` registra ScrollTrigger, SplitText e ScrambleText. `src/lib/gsap-track.ts` registra DrawSVG e MotionPath só no chunk do TrackMap. Flip e CustomEase não são registrados (nenhum componente usa). A SPEC §7.6 pede registro único em `gsap.ts`. Justificativa: orçamento de bundle (§11). Recomendo **manter a divisão e registrar a exceção na SPEC**, já que juntar tudo aproxima o chunk inicial do limite.

### 3.7 Achados do detector e das guidelines que **não** devem ser aplicados

- [ ] **F1. "Gradient text"** (`index.css:179`, `.text-silver`) · *diverge da SPEC (não aplicar)*: o gradiente metálico é identidade (SPEC §4).
- [ ] **F2. "Decorative grid-line background"** (`index.css:187`, `.carbon`) · *diverge da SPEC (não aplicar)*: a fibra de carbono está na SPEC §4.
- [ ] **F3. "Title Case em botões e títulos"** (web-design-guidelines) · *diverge da SPEC (não aplicar)*: o site é em português e o conteúdo vem de `site.ts`.
- [ ] **F4. `transition-all` no `badge.tsx:7`** (shadcn) · *melhoria sugerida* · **baixa**: listar as propriedades. Os badges não são interativos, então o impacto é nulo.
- [ ] **F5. Sem `overscroll-behavior: contain` no Sheet e sem `touch-action: manipulation`** (web-design-guidelines) · *melhoria sugerida* · **baixa**.
- [ ] **F6. Nomes de marca/tecnologia sem `translate="no"`** (web-design-guidelines) · *melhoria sugerida* · **baixa**: "BabelCall", "Doctor Genesis" etc. podem ser traduzidos pelo tradutor automático do navegador.

### 3.8 O que está bom (manter)

- Conteúdo 100% em `site.ts`, com `isTodo()` escondendo pendências de forma consistente e destaque âmbar tracejado só em dev.
- Movimento reduzido e pausa bem arquitetados: `MotionProvider` + `finishAllAnimations()` + CSS `[data-reveal]` + script inline no `<head>` para não piscar.
- Reveals usam `opacity` (focáveis); `CountUp` e rádio têm texto final em `sr-only`; placeholders com `role="img"` e rótulo.
- Intro: hero renderizado por baixo, h1 sem `opacity: 0` no CSS, timeline com posições, limpeza garantida no unmount.
- Sem scroll horizontal e alvos de toque ≥ 44 px em todas as larguras.

---

## 4. `TODO_DAVI` restantes

Saída de `grep -rn "TODO" src index.html vite.config.ts` (só as pendências de conteúdo; linhas de infraestrutura como a definição de `TODO`/`isTodo` e comentários de documentação estão em seguida):

| Arquivo:linha | Pendência |
|---|---|
| `src/content/site.ts:25-28` | `profile.pitch`: frase provisória (`pitchIsDraft: true`) |
| `src/content/site.ts:29` | `profile.city` (cidade) |
| `src/content/site.ts:32` | `profile.availability`: confirmar |
| `src/content/site.ts:33` | `profile.remote`: confirmar |
| `src/content/site.ts:34` | `profile.yearsExperience` |
| `src/content/site.ts:62` | `teamRadio.message`: confirmar em que está trabalhando |
| `src/content/site.ts:110` | Mariana: confirmar status ("Em produção") |
| `src/content/site.ts:147` | Mariana: URL ao vivo |
| `src/content/site.ts:157` | Doctor Genesis: confirmar status |
| `src/content/site.ts:190` | Doctor Genesis: URL ao vivo |
| `src/content/site.ts:202` | RGóis: confirmar status |
| `src/content/site.ts:247` | BabelCall: URL ao vivo |
| `src/content/site.ts:261` | Grupos do "Setup do carro": confirmar |
| `src/content/site.ts:301` | Fato "Temporadas" (anos de experiência) |
| `src/content/site.ts:304-305` | Parágrafos do Sobre |
| `src/content/site.ts:318` | `contact.whatsapp` |
| `src/content/site.ts:320` | `contact.email` |
| `src/content/site.ts:322` | `contact.linkedin` |
| `src/content/site.ts:352` | `seo.siteUrl` = `TODO_DOMINIO` |

Linhas de infraestrutura (não são pendências): `site.ts:5,6,11,12,16` (definição de `TODO`/`isTodo`), `Contact.tsx:15`, `DriverCard.tsx:11`, `ProjectCase.tsx:22` (comentários), `PitButton.tsx:84` e `CopyEmailButton.tsx:46` (`title` de aviso, só em dev). `index.html` e `vite.config.ts`: nenhuma ocorrência.

Fora do grep, mas pendente (SPEC §9 e §13): imagens dos 4 projetos e foto do Davi; currículo em PDF (opcional, `contact.cvUrl = null`); decisão sobre o repositório público da Mariana; favicon, `og.png`, `robots.txt` e o plugin de SEO/JSON-LD (adiados).

Para o Davi rodar (o QA não pode): `grep -rni "<nome real da administradora>" src index.html public docs vite.config.ts dist`.

---

## 5. Limitações do teste

- **Navegador:** o Playwright MCP não roda nesta máquina (erro de GTK no Chrome). Os testes usaram `playwright-core` com o Chrome do sistema em headless, por script Node. Touch foi emulado (`hasTouch`/`isMobile`); não houve teste em aparelho físico, Safari/WebKit ou Firefox.
- **Leitor de tela:** sem NVDA/VoiceOver. A semântica foi verificada por DOM, axe e Lighthouse, não por escuta.
- **Lighthouse:** uma rodada só, mobile simulado, servidor local (sem CDN, sem compressão real da Vercel). A intro estava rodando no momento da coleta, o que explica o `landmark-one-main`. SEO não foi medido (adiado). INP não se mede em laboratório.
- **axe:** axe-core 4.10.2 injetado via CDN só no teste (não instalado no projeto). Rodou em 1440 e em 390 com reduced-motion, depois de rolar a página para disparar os reveals. 23 e 13 checagens de contraste ficaram "incompletas" (texto sobre gradiente ou fundo indeterminável, ex.: `.text-silver`), que o axe não consegue calcular. Os pares de tokens foram calculados à parte (item 12).
- **WhatsApp, copiar e-mail e toast:** não testáveis no build com os contatos em `TODO_DAVI`. Verificação só por código.
- **Cliente da Mariana:** o nome real não é conhecido pelo QA e não foi procurado. O grep fica com o Davi.
- **Timing da intro:** medido por `MutationObserver` no headless. Em CPU lenta o véu de carregamento do chunk (~0,4 s aqui) pode crescer.
- **A9 (header cobrindo o foco)** é risco apontado pela leitura do código, sem reprodução em teste.
- `/critique` rodou em contexto único (sem os dois sub-agentes que a skill pede) e o overlay visual do detector não foi injetado. O detector rodou por CLI sobre `src` e `index.html`.

---

## Correções aplicadas após o QA (11/11/2026)

Só itens reprovados e correções de acessibilidade sem mudança de design. Verificado no build (`npm run preview`), bundle inicial 184,63 KB gz.

- [x] **Reprovado 1 · Teclado na Classificação:** `Classification.tsx` usa `opacity` em vez de `autoAlpha` na entrada das linhas. Tab a partir do topo agora passa por Mariana, Doctor Genesis, RGóis Odontologia e BabelCall em 1280 (tabela) e 390 (cards).
- [x] **Reprovado 2 · Contraste do "12" do `ImagePlaceholder`:** `text-silver-500/60` → `text-silver-500` (token AA).
- [x] **Seta da tabela sem clique:** ícone com `pointer-events-none`; o clique cai no link que cobre a linha.
- [x] **Tab durante a intro:** header, skip link e rodapé também ficam `inert` durante a intro; o foco fica no overlay ("Pular largada").
- [x] **Nome acessível do logo:** sem `aria-label`; o nome vem do texto visível "DC #12" + "Davi Curty" em `sr-only` (label-in-name).

Pendentes de decisão do Davi (não aplicados): breakpoint do TrackMap, `ui.navLabel` e `telemetrySection` em `site.ts`, preload da fonte do h1 (vai junto com o SEO, no `index.html`), registro dos plugins GSAP dividido (exceção à SPEC §7.6).
