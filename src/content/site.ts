/**
 * Fonte única de conteúdo do portfólio (SPEC §2–§6).
 * Nenhum componente tem texto fixo: tudo vem daqui, inclusive strings de interface (`ui`).
 *
 * Pendências ficam como `TODO_DAVI` (ou `TODO_DOMINIO`). Não inventar, não remover.
 * Valores `TODO_DAVI` NÃO são renderizados na tela (links e fatos somem até serem preenchidos).
 *
 * Confidencialidade: o cliente da Mariana é sempre "administradora de consórcio".
 */

export const TODO = "TODO_DAVI" as const;
export type Todo = typeof TODO;

/** true se o valor ainda é uma pendência (ou está vazio). */
export const isTodo = (value: unknown): value is Todo | null | undefined =>
  value === TODO || value === null || value === undefined || value === "";

/* ───────────────────────────── Perfil ───────────────────────────── */

export const profile = {
  name: "Davi Curty",
  role: "Desenvolvedor Full-stack",
  number: 12,
  initials: "DC",
  /** TODO_DAVI: frase provisória, confirmar ou trocar. */
  pitch:
    "Construo produtos web de ponta a ponta: interfaces rápidas, APIs sólidas e agentes de IA que atendem no WhatsApp.",
  pitchIsDraft: true,
  city: TODO as string, // TODO_DAVI: ex.: "Volta Redonda, RJ"
  country: "Brasil",
  nationalityCode: "BRA",
  availability: "Disponível para projetos", // TODO_DAVI: confirmar
  remote: true, // TODO_DAVI: confirmar
  yearsExperience: null as number | null, // TODO_DAVI
  photo: null as string | null, // futuro: "/images/davi.webp"
} as const;

/* ───────────────────────────── Navegação ───────────────────────────── */

export const nav = [
  { id: "grid", position: "P1", label: "Grid" },
  { id: "classificacao", position: "P2", label: "Classificação" },
  { id: "setup", position: "P3", label: "Setup" },
  { id: "piloto", position: "P4", label: "Piloto" },
  { id: "box", position: "P5", label: "Box" },
] as const;

/* ───────────────────────────── Intro e hero ───────────────────────────── */

export const intro = {
  gridLabel: "GRID · P1",
  number: "#12",
} as const;

export const hero = {
  eyebrow: "Piloto #12 · Full-stack",
  scrollCue: "Role para largar",
} as const;

export const teamRadio = {
  label: "Rádio do box",
  /** TODO_DAVI: confirmar em que está trabalhando agora. */
  message: "Box, box: construindo o BabelCall, chamadas com tradução em tempo real.",
} as const;

/* ───────────────────────────── Projetos ───────────────────────────── */

export type ProjectStatus = "Em produção" | "Entregue" | "Treino livre";

export type Telemetry = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export type Project = {
  slug: string;
  position: 1 | 2 | 3 | 4;
  name: string;
  tagline: string;
  category: string;
  status: ProjectStatus;
  /** Métrica curta da coluna "TEMPO" da Classificação. */
  headline: string;
  problem: string;
  solution: string;
  highlights: string[];
  stack: string[];
  telemetry: Telemetry[];
  links: { repo: string | null; live: string | Todo | null };
  images: { cover: string | null; gallery: string[] };
  disclaimer?: string;
};

export const classification = {
  eyebrow: "Classificação · Temporada 2026",
  title: "Resultados de pista",
  subtitle: "Quatro projetos, do agente de IA em produção ao que ainda está em treino livre.",
} as const;

export const projects: Project[] = [
  {
    slug: "mariana",
    position: 1,
    name: "Mariana",
    tagline: "Agente de IA que atende, informa e agenda consultores pelo WhatsApp.",
    category: "Agente de IA · WhatsApp",
    status: "Em produção", // TODO_DAVI: confirmar status
    headline: "22 endpoints",
    problem:
      "Uma administradora de consórcio recebia interessados pelo WhatsApp e dependia de atendimento humano para todo primeiro contato: tirar dúvidas básicas, entender o objetivo de cada cliente e encontrar um horário livre com um consultor.",
    solution:
      "A Mariana faz esse primeiro atendimento. Ela recebe o cliente, entende o que ele quer, explica o básico a partir de uma base de conhecimento aprovada e leva quem tem interesse a uma reunião com um consultor, com horário real no Google Agenda e link do Google Meet.",
    highlights: [
      "Agente com Gemini e respostas validadas por schema Zod, com proteção contra prompt injection e fatos vindos só de uma base autorizada.",
      "Máquina de estados da conversa: saudação, nome, motivo, informações, oferta de consultor, horários e confirmação.",
      "Agendamento atômico no Google Calendar com Meet, revalidação de disponibilidade e rollback de compensação.",
      "Fila durável de tarefas com leases e fila de saída que respeita a janela de 24h do WhatsApp e o opt-out.",
      "Spec de comportamento com regras numeradas, usada por agentes auditores sobre o código e as conversas.",
    ],
    stack: [
      "TypeScript",
      "Node.js",
      "Fastify",
      "Next.js",
      "React",
      "Gemini",
      "WhatsApp API",
      "Google Calendar API",
      "PostgreSQL",
      "Neon",
      "Drizzle",
      "Zod",
      "Tailwind",
      "shadcn/ui",
    ],
    telemetry: [
      { label: "Endpoints na API", value: 22 },
      { label: "Tabelas no banco", value: 11 },
      { label: "Arquivos de teste", value: 100, prefix: "+" },
      { label: "Integrações externas", value: 3 },
    ],
    links: {
      repo: "https://github.com/DaviC18/Mariana-Core",
      live: TODO, // TODO_DAVI: URL ao vivo
    },
    images: { cover: null, gallery: [] },
  },
  {
    slug: "doctor-genesis",
    position: 2,
    name: "Doctor Genesis",
    tagline: "Pré-triagem de saúde com IA para organizar o primeiro atendimento.",
    category: "IA aplicada · Saúde",
    status: "Entregue", // TODO_DAVI: confirmar status
    headline: "4 níveis de urgência",
    problem:
      "O primeiro contato de um paciente costuma chegar desorganizado: sintomas soltos, datas imprecisas e nenhuma ideia de prioridade, o que atrasa a triagem.",
    solution:
      "O paciente preenche um formulário estruturado de sintomas e a plataforma gera um relatório pré-diagnóstico para apoiar o profissional de saúde: título, resumo, alertas, exames sugeridos, nível de urgência e próximo passo.",
    highlights: [
      "Front-end Next.js e API Fastify separados, com autenticação Clerk e JWT.",
      "Saída da IA tipada e validada com Zod, classificada em quatro níveis de urgência.",
      "Banco PostgreSQL (Neon) modelado com Drizzle ORM.",
      "API documentada com Swagger e testes com Vitest nas rotas e na geração da IA.",
    ],
    stack: [
      "TypeScript",
      "Next.js",
      "React",
      "Fastify",
      "Gemini",
      "PostgreSQL",
      "Neon",
      "Drizzle",
      "Clerk",
      "Zod",
      "Vitest",
      "Swagger",
    ],
    telemetry: [
      { label: "Endpoints na API", value: 5 },
      { label: "Níveis de urgência", value: 4 },
      { label: "Arquivos de teste", value: 6 },
    ],
    links: {
      repo: "https://github.com/DaviC18/Dg-project",
      live: TODO, // TODO_DAVI: URL ao vivo
    },
    images: { cover: null, gallery: [] },
    disclaimer:
      "O Doctor Genesis não substitui médicos, diagnóstico, atendimento de emergência nem avaliação clínica profissional. É uma ferramenta de apoio para organizar informações na pré-triagem.",
  },
  {
    slug: "rgois-odontologia",
    position: 3,
    name: "RGóis Odontologia",
    tagline: "Site de clínica feito para levar o paciente direto ao WhatsApp.",
    category: "Site · Cliente real",
    status: "Entregue", // TODO_DAVI: confirmar status
    headline: "1 objetivo: agendar",
    problem:
      "Um consultório de família em Barra Mansa (RJ), com mais de 40 anos de história e nota 5,0 no Google, tinha um site feito no Canva: ilegível no celular, sem serviços, sem endereço e sem SEO.",
    solution:
      "Um site single page construído do zero com um único objetivo: levar o visitante a abrir uma conversa no WhatsApp para agendar, com conteúdo organizado e animação que não atrapalha a leitura.",
    highlights: [
      "Todos os botões de agendamento abrem o WhatsApp com mensagem pronta e registram de qual seção veio o clique.",
      "Botão flutuante do WhatsApp depois que o topo sai da tela.",
      "Animações com GSAP e Lenis que respeitam o movimento reduzido.",
      "Desenvolvimento guiado por SPEC, PLAN e AGENTS.md, com todo o texto em um único arquivo.",
    ],
    stack: ["Vite", "React", "TypeScript", "Tailwind v4", "GSAP", "Lenis"],
    telemetry: [
      { label: "Anos de história da clínica", value: 40, prefix: "+" },
      { label: "Nota no Google", value: 5, decimals: 1 },
    ],
    links: {
      repo: "https://github.com/DaviC18/rgoisodontologia",
      live: null, // decidido: só GitHub
    },
    images: { cover: null, gallery: [] },
  },
  {
    slug: "babelcall",
    position: 4,
    name: "BabelCall",
    tagline: "Chamadas em que cada pessoa fala no próprio idioma.",
    category: "Produto · Em desenvolvimento",
    status: "Treino livre",
    headline: "Em desenvolvimento",
    problem:
      "Conversar com clientes e parceiros de outros países ainda esbarra no idioma, principalmente para quem quer apresentar um projeto ou um serviço fora do Brasil.",
    solution:
      "Salas de conversa em que cada pessoa fala no seu idioma e a outra acompanha com legenda traduzida. A interface, as salas e a estrutura de dados já existem; a tradução está em desenvolvimento.",
    highlights: [
      "Criação de sala com link compartilhável.",
      "Seleção de idioma de origem e destino (português, inglês, espanhol, francês e alemão).",
      "Next.js 16 com React Compiler, shadcn/ui e tema claro/escuro.",
      "Banco PostgreSQL com Drizzle ORM e validação com Zod.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind v4", "shadcn/ui", "Drizzle", "PostgreSQL", "Zod"],
    telemetry: [],
    links: {
      repo: "https://github.com/DaviC18/BabelCall",
      live: TODO, // TODO_DAVI: URL ao vivo
    },
    images: { cover: null, gallery: [] },
  },
];

/* ───────────────────────────── Stack (Setup do carro) ───────────────────────────── */

export const stackSection = {
  eyebrow: "Setup do carro",
  title: "O que vai no carro",
  subtitle: "As ferramentas que uso para levar um projeto da ideia ao ar.",
} as const;

/** TODO_DAVI: confirmar os grupos (montados a partir dos repositórios). */
export const stack = [
  {
    code: "PU-01",
    name: "Motor",
    area: "Back-end",
    description: "APIs, regras de negócio e dados.",
    items: ["Node.js", "TypeScript", "Fastify", "PostgreSQL", "Drizzle ORM", "Zod"],
  },
  {
    code: "AE-02",
    name: "Aerodinâmica",
    area: "Front-end",
    description: "Interfaces rápidas, acessíveis e com movimento.",
    items: ["React", "Next.js", "Vite", "Tailwind CSS", "shadcn/ui", "GSAP"],
  },
  {
    code: "ST-03",
    name: "Estratégia",
    area: "IA e automação",
    description: "Agentes e automações que trabalham pelo negócio.",
    items: ["Gemini", "Agentes de IA", "WhatsApp API", "Google Calendar API"],
  },
  {
    code: "BX-04",
    name: "Box",
    area: "Infra e qualidade",
    description: "Deploy, banco gerenciado e testes.",
    items: ["Vercel", "Neon", "Vitest", "Biome", "Git"],
  },
] as const;

/* ───────────────────────────── Sobre (Card de piloto) ───────────────────────────── */

export const about = {
  eyebrow: "Card de piloto",
  title: "Piloto #12",
  facts: [
    { label: "Base", value: profile.city },
    { label: "Nacionalidade", value: profile.nationalityCode },
    { label: "Temporadas", value: TODO as string }, // TODO_DAVI: anos de experiência
    { label: "Especialidade", value: "Full-stack · IA · Automação" },
  ],
  /** TODO_DAVI: escrever 1–2 parágrafos sobre você. */
  paragraphs: [TODO as string],
} as const;

/* ───────────────────────────── Contato (Box) ───────────────────────────── */

export const contactSection = {
  eyebrow: "Box",
  title: "Chamar o box",
  subtitle: "Tem um projeto, uma automação ou um agente de IA em mente? Me chama e a gente conversa.",
} as const;

export const contact = {
  /** Só dígitos, com DDI e DDD. Ex.: "5524999999999". */
  whatsapp: TODO as string, // TODO_DAVI
  whatsappMessage: "Olá, Davi! Vi seu portfólio e quero conversar sobre um projeto.",
  email: TODO as string, // TODO_DAVI
  github: "https://github.com/DaviC18",
  linkedin: TODO as string, // TODO_DAVI
  cvUrl: null as string | null, // opcional: "/cv.pdf"
} as const;

export const whatsappLink = (message: string = contact.whatsappMessage): string =>
  `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;

/* ───────────────────────────── Pista e rodapé ───────────────────────────── */

export const trackMap = {
  sectors: [
    { label: "S1", target: "classificacao" },
    { label: "S2", target: "setup" },
    { label: "S3", target: "box" },
  ],
} as const;

export const footer = {
  folio: "Folio 2026",
  credit: "Desenhado e desenvolvido por Davi Curty.",
  disclaimer:
    "Projeto pessoal com estética inspirada no automobilismo. Sem vínculo com equipes, fabricantes ou com a Fórmula 1.",
} as const;

/* ───────────────────────────── SEO ───────────────────────────── */

export const seo = {
  title: "Davi Curty · Desenvolvedor Full-stack · Folio 2026",
  description:
    "Portfólio de Davi Curty, desenvolvedor full-stack: sites, APIs, automações e agentes de IA para WhatsApp.",
  siteUrl: "TODO_DOMINIO",
  locale: "pt_BR",
  themeColor: "#0A0A0B",
  ogImage: "/og.png",
} as const;

/* ───────────────────────────── Strings de interface ───────────────────────────── */

export const ui = {
  skipLink: "Pular para o conteúdo",
  skipIntro: "Pular largada",
  openMenu: "Abrir menu",
  closeMenu: "Fechar menu",
  live: "Ao vivo",
  callBox: "Chamar o box",
  seeClassification: "Ver classificação",
  copyEmail: "Copiar e-mail",
  emailCopied: "E-mail copiado",
  emailCopyFailed: "Não consegui copiar. Abrindo seu app de e-mail.",
  sendEmail: "Mandar e-mail",
  github: "GitHub",
  linkedin: "LinkedIn",
  downloadCv: "Baixar currículo",
  seeCode: "Ver código",
  seeLive: "Ver ao vivo",
  problem: "Problema",
  solution: "Solução",
  highlights: "Destaques",
  stack: "Stack",
  telemetry: "Telemetria",
  telemetryPending: "Telemetria em coleta: projeto em treino livre.",
  inProgressNote: "Em desenvolvimento. Algumas funções ainda são simuladas.",
  imageSoon: "Imagem em breve",
  remote: "Remoto",
  pauseMotion: "Pausar animações",
  resumeMotion: "Retomar animações",
  tableHeaders: { position: "Pos", project: "Projeto", status: "Status", time: "Tempo" },
  newTab: "(abre em nova aba)",
} as const;
