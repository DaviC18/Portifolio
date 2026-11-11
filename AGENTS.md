# AGENTS.md: Portfólio Davi Curty

Portfólio pessoal single-page de **Davi Curty, Desenvolvedor Full-stack**, piloto **#12**.
Tema: Fórmula 1, inspirado nas "Flechas de Prata" (prata, preto, verde-água, fibra de carbono, telemetria).
Stack: Vite + React 19 + TypeScript + Tailwind v4 + GSAP (ScrollTrigger, SplitText, ScrambleText, MotionPath, Flip) + Lenis + shadcn/ui.

## Leia antes de qualquer coisa

1. `docs/SPEC.md`: o que construir (identidade, seções, componentes, animação, critérios de aceite)
2. `docs/PLAN.md`: em que ordem, e quem é dono de quais arquivos
3. `src/content/site.ts`: **todo** o texto do site, inclusive strings de interface. Nunca escreva conteúdo fora dele

Ordem de autoridade em qualquer conflito: `docs/SPEC.md` > `docs/PLAN.md` > skills > bom senso.

## Regras inegociáveis

- **Marca de terceiros:** o tema é *inspirado* em F1. Proibido usar a estrela da Mercedes, as palavras "Mercedes", "AMG", "Petronas", "Formula 1"/"F1" como marca, o logo da F1, fontes oficiais da F1, fotos de carros, pilotos ou circuitos reais. Traçado de pista é **fictício** e desenhado do zero. Única exceção: o aviso `footer.disclaimer` de `site.ts`, que cita a Fórmula 1 só para dizer que não há vínculo.
- **Cliente da Mariana:** nunca citar o nome da administradora de consórcio em texto, alt, metadado, comentário de código ou nome de arquivo. Usar "administradora de consórcio".
- **Conteúdo:** não inventar projetos, números, clientes, depoimentos, cargos ou experiência. Pendências ficam como `TODO_DAVI` em `site.ts` e aparecem na lista final.
- **Imagens:** ainda não existem. Usar o componente `ImagePlaceholder` (SPEC §9). Não usar banco de imagens nem gerar imagens.
- **Animação:** GSAP é a **única** biblioteca de animação (sem Framer Motion/`motion`). `useGSAP` sempre com `scope`. Só `transform` e `opacity`, salvo as exceções da SPEC §7.
- **Acessibilidade:** mobile-first, sem scroll horizontal em 360px, `prefers-reduced-motion` respeitado em tudo, botão "Pausar animações" funcionando.
- **Strings:** botões, rótulos e títulos de seção também ficam em `site.ts` (objeto `ui` ou objeto da seção).

## Comandos

- `npm run dev`: desenvolvimento (`?demo=<nome>` abre `src/**/_demo-<nome>.tsx`, só em dev)
- `npm run build`: checagem de tipos + build. **Precisa passar antes de entregar qualquer WP**
- `npm run preview`: conferir o build
- `npm run lint`: ESLint

## Skills

Instaladas na Fase 0 (ver PLAN). Elas **ajudam a executar** a SPEC, não mudam a SPEC.

| Skill | Quando usar | Não pode |
|---|---|---|
| `gsap-skills` (gsap-core, timeline, scrolltrigger, plugins, react, performance, utils) | Ao escrever qualquer animação | — |
| `motion-design` (LottieFiles) | Ao decidir duração, easing, stagger e coreografia. Personalidade: **Premium** com picos **Energetic** (SPEC §7) | Trocar a personalidade |
| `frontend-design` | Decisões de detalhe que a SPEC não cobre (espaçamento fino, hierarquia) | Trocar paleta ou fontes |
| `impeccable` | Fase 4: `/critique`, `/audit`, `/polish`. Pode usar `/animate` para revisar movimento | Trocar paleta, fontes, tema ou reescrever conteúdo |
| `vercel-react-best-practices`, `vercel-composition-patterns` | Escrever e revisar componentes | Trocar a stack (nada de Next.js) |
| `web-design-guidelines` | Fase 4: checklist de tipografia, espaçamento e acessibilidade | — |
| `find-skills` | Fase 0: procurar skills úteis (shadcn, Tailwind v4, SVG animation, a11y) | Instalar algo sem listar no relatório |

Se uma skill sugerir algo que contradiz a SPEC (ex.: "evite fundo escuro", "use Framer Motion", "use Next.js"), **siga a SPEC** e registre a divergência no relatório.

## Reaproveitamento

O projeto `https://github.com/DaviC18/rgoisodontologia` (mesma stack, mesmo autor) tem componentes prontos. A Fase 0/1 copia e **adapta** (tokens, cores, textos) os arquivos listados no PLAN. Nunca copiar textos, cores ou imagens do RGóis.

## Relatório de cada WP

Ao terminar um WP, escrever no fim da resposta:
- arquivos criados/alterados
- decisões tomadas
- divergências com skills
- "Notas para o integrador" (o que precisa de outro WP ou de texto novo em `site.ts`)
- resultado do `npm run build`
