# PLANO DE EXECUÇÃO: Portfólio Davi Curty

> Leia `AGENTS.md` e `docs/SPEC.md` inteiros antes de começar. Conteúdo **somente** de `src/content/site.ts`.
> Cada pacote de trabalho (WP) tem **dono exclusivo dos arquivos listados**. Não edite arquivos de outro WP: se precisar de algo, registre em "Notas para o integrador" no seu relatório.

## Visão geral

```
Fase 0  Fundação + skills (1 agente)               ──►  bloqueia todo o resto
Fase 1  Componentes base (1 agente)                ──►  bloqueia a Fase 2
Fase 2  Seções (até 4 agentes em paralelo)         ──►  WP-A · WP-B · WP-C · WP-D
Fase 3  Integração + SEO (1 agente)
Fase 4  QA (1 agente que NÃO escreveu código)
Fase 5  Polimento (só itens aprovados pelo Davi)
Fase 6  Deploy (após aprovação do Davi)
```

Ao final de cada fase: `npm run build` sem erros, relatório no formato do `AGENTS.md` e **parar** para o Davi revisar antes da próxima fase.

---

## Fase 0: Fundação (WP-0)

**Arquivos:** `package.json`, `vite.config.ts` (até a Fase 3), `tsconfig*.json`, `index.html` (esqueleto), `components.json`, `src/main.tsx`, `src/App.tsx` (esqueleto), `src/styles/index.css`, `src/lib/*`, `src/components/ui/*`, `.gitignore`, `README.md`, `.claude/skills/*`

1. **Projeto:** inicializar Vite `react-ts` **nesta pasta**, preservando `AGENTS.md`, `CLAUDE.md`, `docs/` e `src/content/site.ts`. Se o scaffolder recusar pasta não vazia, gerar num diretório temporário e mover. Remover resíduos do template (`src/assets/*`, `src/App.css`, `public/vite.svg`, ícones de exemplo).
2. **Dependências:**
   - `tailwindcss @tailwindcss/vite gsap @gsap/react lenis lucide-react`
   - `@fontsource-variable/saira @fontsource/titillium-web @fontsource-variable/jetbrains-mono` (ver SPEC §4 sobre o eixo `wdth`)
   - Dev: `prettier prettier-plugin-tailwindcss` (ESLint padrão do Vite)
3. **TypeScript:** `strict`, `noUncheckedIndexedAccess`, alias `@/` → `src/` (em `tsconfig.app.json` e `vite.config.ts`).
4. **shadcn/ui:** `npx shadcn@latest init` (Vite, Tailwind v4, alias `@/`), depois `npx shadcn@latest add button badge tooltip sheet sonner`. Ajustar as variáveis do shadcn para apontar para os tokens da SPEC §4 (fundo carbon, primário teal, borda `line`). Sem tema claro.
5. **Skills** (instalar no projeto; se algum comando falhar, rodar `npx skills find <nome>` e usar o caminho que aparecer, registrando no relatório):
   ```bash
   npx skills add https://github.com/greensock/gsap-skills
   npx -y skills add lottiefiles/motion-design-skill --skill motion-design --agent claude-code
   npx skills add anthropics/skills@frontend-design
   npx skills add pbakaus/impeccable
   npx skills add vercel-labs/skills@find-skills
   npx skills add vercel-labs/agent-skills@vercel-react-best-practices
   npx skills add vercel-labs/agent-skills@web-design-guidelines
   npx skills add vercel-labs/agent-skills@vercel-composition-patterns
   ```
   Depois rodar `npx skills find` para: `shadcn`, `tailwind v4`, `svg animation`, `accessibility`. **Listar** os resultados úteis no relatório, sem instalar. O Davi decide.
6. **Base do RGóis:** clonar `https://github.com/DaviC18/rgoisodontologia` num diretório temporário **fora** do projeto e copiar para `src/lib/`: `gsap.ts`, `lenis.ts`, `track.ts`, `useReducedMotion.ts`. Adaptar:
   - `gsap.ts`: registrar `ScrollTrigger`, `SplitText`, `ScrambleTextPlugin`, `MotionPathPlugin`, `Flip`, `DrawSVGPlugin`, `CustomEase`.
   - `lenis.ts`: hook `useLenis()` sincronizado com o ScrollTrigger, que não roda com movimento reduzido ou pausado e expõe `scrollTo(target)` com offset do header, `stop()` e `start()`.
   - `track.ts`: eventos da SPEC §2.
   - Apagar o clone temporário no fim.
7. **`src/lib/motion.tsx`:** `MotionProvider` + `useMotion()` conforme a SPEC §7.5.
8. **`src/lib/utils.ts`:** `cn()` do shadcn (já criado no init).
9. **`src/styles/index.css`:** `@import "tailwindcss"`, `@theme` com **todos** os tokens da SPEC §4, base (body carbon-950, texto white, `::selection` teal com texto carbon, `:focus-visible` teal), utilitários `.text-silver`, `.carbon`, `.chamfer`, `.container-site`, e as regras de `[data-reveal]` (escondido só com `html.js`, sempre visível com `prefers-reduced-motion: reduce` ou `html[data-motion="off"]`).
10. **`index.html`:** `lang="pt-BR"`, `theme-color`, script inline que adiciona `js` ao `<html>` e lê `localStorage["dc:motion"]` (em `try/catch`) para já aplicar `data-motion="off"`.
11. **`main.tsx`:** importa fontes e CSS, envolve `<App />` em `MotionProvider`, e carrega `src/**/_demo-*.tsx` via `?demo=<nome>` (só em dev, `import.meta.glob`).
12. **`App.tsx`:** `<main id="conteudo">` com comentários-placeholder na ordem da SPEC §5 e o `<Toaster />` do sonner. A partir daqui o `App.tsx` é do integrador (WP-3): nenhum WP da Fase 2 edita esse arquivo.

**Pronto quando:** `npm run dev` sobe, `npm run build` passa, a página mostra o fundo carbon com um texto de teste nas 3 fontes, um título com `.text-silver` e um botão shadcn em teal. Relatório com as skills instaladas e os resultados do `find-skills`.

---

## Fase 1: Componentes base (WP-1)

**Arquivos:** `src/components/motion/*` (exceto `StartLights`, `TrackMap` e `SpeedLines`), `src/components/common/*` (exceto `ContactDock`)

Implementar os componentes da SPEC §8:
- **Adaptar do RGóis** (copiar do clone temporário e trocar tokens/textos): `Reveal`, `SplitHeading`, `CountUp`, `MagneticButton`, `SpotlightCard`, `SectionHeader`, `CarbonBg` (a partir do `Grain`).
- **Novos:** `PitButton`, `CopyEmailButton`, `StatusPill`, `PositionBadge`, `TelemetryBar`, `ImagePlaceholder`, `MotionToggle`, `SkipLink`.

Regras:
- Todo componente animado usa `useGSAP({ scope })` + `gsap.matchMedia()` + `useMotion().allowed`, e tem caminho para movimento reduzido/pausado.
- Strings vêm de `ui` em `site.ts`.
- `PitButton` exige a prop `origem`.
- Criar `src/components/_demo-components.tsx` (abre em `?demo=components`) mostrando todos, com um `MotionToggle` no topo para testar o modo pausado.

Skills desta fase: `gsap-skills` (react, core, performance), `motion-design`, `vercel-composition-patterns`.

**Pronto quando:** build ok e cada componente funciona isolado com movimento normal, reduzido (DevTools → Rendering → emulate) e pausado.

---

## Fase 2: Seções (paralelo)

Todas as seções: `<section id="..." aria-labelledby="...">`, conteúdo de `site.ts`, `SectionHeader` e `Reveal`, mobile-first, testadas em 360 e 1440px.

**Não editar `src/App.tsx` nem `src/content/site.ts`.** Para ver a seção, cada WP cria `src/sections/_demo-<wp>.tsx` (export default) e abre `http://localhost:5173/?demo=<wp>`. Texto que falta em `site.ts` vai para "Notas para o integrador".

Skills desta fase: `gsap-skills` (scrolltrigger, timeline, plugins), `motion-design`, `frontend-design` (só para detalhes que a SPEC não cobre).

### WP-A: Largada e topo
**Arquivos:** `src/components/motion/StartLights.tsx`, `src/sections/TimingTower.tsx`, `src/sections/Hero.tsx`, `src/sections/TeamRadio.tsx`
- `StartLights` exatamente como a SPEC §7.2 (sessionStorage, Esc, pular, `inert` no main, foco, ≤ 3.2s). Expor um callback `onComplete` para o hero começar.
- `TimingTower` com link ativo por seção, esconde/mostra no scroll, `Sheet` no mobile.
- `Hero` com a timeline da SPEC §7.3, "12" de fundo e chips. Recebe uma prop `ready` (inicia a entrada quando a intro termina ou não roda).
- `TeamRadio` com ondas em CSS e `ScrambleText`.
- No `_demo-a.tsx`, botão para limpar `sessionStorage` e rever a intro.

### WP-B: Classificação e telemetria
**Arquivos:** `src/sections/Classification.tsx`, `src/sections/Telemetry.tsx`, `src/sections/ProjectCase.tsx`
- `Classification`: `<table>` no desktop, cards no mobile, prévia seguindo o cursor, stagger de placar.
- `Telemetry` + `ProjectCase` conforme a SPEC §6: telemetria com `CountUp` + `TelemetryBar`, links que somem se `TODO_DAVI`/`null`, disclaimer, status "Treino livre".
- Conferir que **nenhum** texto cita o cliente da Mariana.

### WP-C: Setup, piloto, box e rodapé
**Arquivos:** `src/sections/CarSetup.tsx`, `src/sections/DriverCard.tsx`, `src/sections/Contact.tsx`, `src/sections/Footer.tsx`, `src/components/common/ContactDock.tsx`
- `CarSetup` com 4 painéis e `SpotlightCard`.
- `DriverCard` com reveal em `clip-path` e ficha em mono (fatos `TODO_DAVI` ocultos).
- `Contact` com WhatsApp, copiar e-mail, GitHub, LinkedIn, CV opcional (links `TODO_DAVI` ocultos).
- `Footer` com faixa quadriculada, disclaimer e `MotionToggle`.
- `ContactDock` (aparece depois do hero, some em `#box`, safe-area).

### WP-D: Pista
**Arquivos:** `src/components/motion/TrackMap.tsx`, `src/components/motion/SpeedLines.tsx`
- `TrackMap` conforme a SPEC §7.4: traçado **fictício** original, DrawSVG + MotionPath ligados ao scroll da página, setores S1/S2/S3 alinhados aos ids `classificacao`, `setup` e `box` (calcular com ScrollTrigger, recalcular no `refresh`).
- `SpeedLines` reutilizável (prop `variant: "intro" | "hero"`).
- No `_demo-d.tsx`, uma página longa falsa com os ids para testar.

**Pronto quando (cada WP):** a seção renderiza isolada no `_demo` do WP, o build passa, não há texto fora de `site.ts` e o relatório lista arquivos, decisões e notas para o integrador.

---

## Fase 3: Integração e SEO (WP-3)

**Arquivos:** `src/App.tsx`, `src/main.tsx`, `vite.config.ts`, `src/content/site.ts` (só para as notas dos WPs), `index.html`, `public/favicon.svg`, `public/og.png`, `public/robots.txt`, `scripts/*`

1. Montar o `App` na ordem da SPEC §5: `SkipLink`, `StartLights` (lazy), `TimingTower`, `main#conteudo` com as seções, `Footer`, `TrackMap` (lazy, ≥1280px), `ContactDock`, `Toaster`. Ligar `StartLights.onComplete` → `Hero.ready`.
2. Inicializar o Lenis uma vez. Âncoras do header, da Classificação e dos CTAs rolam com offset.
3. `ScrollTrigger.refresh()` depois de `document.fonts.ready` e do `load`.
4. Aplicar as notas dos WPs em `site.ts` **só** se o texto já tiver sido aprovado pelo Davi. Senão, marcar `TODO_DAVI`.
5. Plugin `transformIndexHtml` em `vite.config.ts` que importa `site.ts` e injeta title, description, OG/Twitter e JSON-LD `Person` (SPEC §10), omitindo URLs absolutas enquanto `seo.siteUrl` for `TODO_DOMINIO`.
6. `favicon.svg` ("12" prata sobre carbon + traço teal) e `og.png` 1200×630. Gerar o PNG com um script em `scripts/og.mjs`. Usar `sharp` (devDependency, justificar no relatório) ou Playwright, se já estiver instalado.
7. `public/robots.txt`.
8. Code splitting: `StartLights`, `TrackMap` e `SpeedLines` com `React.lazy`. Conferir o tamanho do bundle no build (meta < 200KB gz).
9. Remover `src/components/_demo-components.tsx`, `src/sections/_demo-*.tsx`, `src/components/motion/_demo-*.tsx` e o roteamento de demo do `main.tsx`.
10. Rodar `grep -rn "TODO" src index.html vite.config.ts` e anexar o resultado.

**Pronto quando:** a página completa funciona de ponta a ponta, com e sem intro, com movimento normal, reduzido e pausado, e o build passa.

---

## Fase 4: QA (WP-4, agente que **não** escreveu o código)

Usar Playwright (screenshots em 360, 390, 768, 1024, 1280 e 1440px, mais reduced-motion e modo pausado) e as skills `impeccable` (`/critique` e `/audit`) e `web-design-guidelines`.

- [ ] Todos os textos batem com `site.ts`, sem nada inventado (projeto, número, cliente, experiência)
- [ ] **Nenhuma** menção ao cliente da Mariana em texto, alt, metadado, código ou nome de arquivo (`grep -rni` pelo nome)
- [ ] Nenhuma marca proibida (SPEC §1.1): `grep -rniE "mercedes|amg|petronas|formula ?1"` em `src`, `index.html` e `public` (o disclaimer do rodapé é a única exceção permitida)
- [ ] Intro: roda uma vez por sessão, "Pular" e Esc funcionam, não roda com reduced-motion/pausado, foco vai para o main, total ≤ 3.2s
- [ ] Todos os CTAs de WhatsApp abrem `wa.me` com a mensagem certa e `origem` no track. Copiar e-mail mostra toast
- [ ] Links `TODO_DAVI` não aparecem na tela
- [ ] Sem scroll horizontal em 360px e alvos de toque ≥ 44px
- [ ] Teclado: tab pela página toda, menu `Sheet`, linhas da tabela, skip link, foco visível
- [ ] `prefers-reduced-motion` **e** `MotionToggle`: nenhum movimento, conteúdo todo visível, TrackMap/SpeedLines ausentes
- [ ] Lighthouse mobile dentro das metas da SPEC §11 (anexar números) + tamanho do bundle
- [ ] JSON-LD `Person` válido (validator.schema.org)
- [ ] Contraste AA (axe DevTools sem erros sérios)
- [ ] Achados do `impeccable /critique`, `/audit` e `web-design-guidelines`, cada um classificado como "segue a SPEC" / "diverge da SPEC (não aplicar)" / "melhoria sugerida"
- [ ] Lista de `TODO_DAVI` restantes

Saída: `docs/QA-REPORT.md` com aprovado/reprovado por item e screenshots em `docs/qa/`. **Não corrigir nada nesta fase.**

---

## Fase 5: Polimento (WP-5)

Só depois de o Davi marcar no `QA-REPORT.md` quais itens aprovar. Corrigir os reprovados, aplicar as melhorias aprovadas e rodar `impeccable /polish` restrito a esses itens. Repetir o Lighthouse e anexar.

---

## Fase 6: Deploy

Só depois de o Davi aprovar: criar o projeto na Vercel (framework Vite, output `dist`), ativar Vercel Analytics e Speed Insights (ligar o `track.ts`) e publicar a URL de preview. O domínio entra quando o Davi definir `seo.siteUrl`.

---

## Regras gerais para os agentes

- Português do Brasil em toda a interface. Código e nomes de arquivo em inglês.
- Não instalar dependências além das listadas sem justificar no relatório.
- Não usar imagens de banco nem gerar imagens. Não desenhar marcas de terceiros.
- Commits pequenos por WP: `feat(hero): ...`, `feat(components): ...`, `chore(setup): ...`.
- Na dúvida sobre conteúdo, use o que está em `site.ts` e marque `TODO_DAVI`. Na dúvida sobre design, siga a SPEC §4 e prefira o mais sóbrio.
