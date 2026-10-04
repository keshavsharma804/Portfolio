import type { ContentBundle } from './content-types'

/**
 * English source of truth for every translatable string in the portfolio.
 * Structure and ids mirror `profile.ts` so a locale can override single fields.
 */
export const contentEn: ContentBundle = {
  profile: {
    role: 'Full-Stack AI Developer',
    tagline: 'Python · React · GenAI · RAG · Agentic AI',
    summaryLead: 'Full-Stack AI Developer focused on building end-to-end applications.',
    summaryRest:
      'I combine AI capabilities with reliable backend services, databases, APIs and modern web interfaces — taking AI products from workflow design and data integration through evaluation, security and production-oriented deployment, with emphasis on reliable and measurable business applications.',
    availability: 'Open to work',
    location: 'Mohali, Punjab, India',
    outcomes: [
      { id: 'inference', value: '−45%', label: 'production inference with ONNX + TensorRT' },
      { id: 'uptime', value: '<15ms', label: 'service uptime behind CI/CD gates' },
      { id: 'ner', value: '99.9%', label: 'F1 on address-extraction NER' },
    ],
  },

  hero: {
    roles: [
      'Full-Stack AI Developer',
      'RAG & Agentic Systems',
      'FastAPI + React Engineering',
      'LLM Evaluation & Observability',
    ],
    buildRows: [
      { id: 'rag', label: 'RAG systems', detail: 'pgvector · hybrid search · reranking', metric: '20/20 eval' },
      { id: 'agents', label: 'Multi-agent workflows', detail: 'LangGraph · tool calling · MCP', metric: '24/24 eval' },
      { id: 'gateway', label: 'Tool gateway & security', detail: 'JWT/RBAC · guardrails · tracing', metric: '156 tests' },
      { id: 'inventory', label: 'Inventory intelligence', detail: 'structured data + AI workflows', metric: '41,000+' },
      { id: 'support', label: 'Support automation', detail: 'WhatsApp · Gmail · Freshdesk', metric: '185 cases' },
    ],
    telemetry: [
      { id: 'ragEval', label: 'RAG evaluations', value: '20/20 passed' },
      { id: 'prodPaths', label: 'Production paths', value: '24/24 passed' },
      { id: 'tests', label: 'Automated tests', value: '156 passing' },
    ],
    console: {
      title: 'AI System / Core',
      state: 'Online',
      coreLabel: 'AI Core',
      capabilities: 'Capabilities',
      telemetry: 'System telemetry',
      activity: 'Activity',
      /*
       * The log restates the reliability work the rows above summarise. Every
       * line maps to something in the CV — there is no invented telemetry and
       * no claim of a live connection behind them.
       */
      lines: [
        { id: 'sessions', text: 'sessions persisted · retries · failure recovery' },
        { id: 'tracing', text: 'execution traces · replayable sessions · verify gates' },
        { id: 'sandbox', text: 'sandboxed tool execution · capability-based access' },
        { id: 'guardrails', text: 'guardrails · prompt-injection defense · rate limits' },
      ],
    },
  },

  stats: [
    { id: 'years', label: 'Years in AI & software' },
    { id: 'areas', label: 'Core skill areas' },
    { id: 'systems', label: 'End-to-end AI systems' },
    { id: 'stages', label: 'Agent execution stages' },
  ],

  snapshot: {
    title: 'System snapshot',
    state: 'Read-only',
    heading: 'The systems behind the work.',
    tags: [
      { id: 'years', text: 'Track' },
      { id: 'areas', text: 'Matrix' },
      { id: 'systems', text: 'Graph' },
      { id: 'stages', text: 'Pipeline' },
    ],
  },

  skillGroups: [
    { id: 'languages', label: 'Programming & Data' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'databases', label: 'Databases' },
    { id: 'genai', label: 'Generative AI' },
    { id: 'rag', label: 'RAG & Agentic AI' },
    { id: 'ml', label: 'ML / DL / NLP' },
    { id: 'engineering', label: 'AI Engineering' },
    { id: 'deployment', label: 'Deployment & Tools' },
  ],

  experience: [
    {
      id: 'webvory',
      role: 'AI Engineer',
      location: 'Mohali, India',
      bullets: [
        'Designed LangGraph-based multi-agent workflows for campaign generation and operational reporting, coordinating AI reasoning, business tools, structured workflows and automated execution.',
        'Built an LLM evaluation framework using GPT-4o to assess generated outputs, validate workflow behavior and support quality monitoring across AI applications.',
        'Developed an inventory intelligence system reconciling 41,000+ products across 57 vendors, connecting structured product data with AI-driven operational workflows.',
        'Built a RAG-powered multi-channel support system using Claude and FAISS, connecting WhatsApp, Gmail and Freshdesk with a 185-scenario knowledge base.',
      ],
    },
    {
      id: 'presage',
      role: 'Software Developer',
      location: 'Noida, India',
      bullets: [
        'Developed and maintained Node.js/Express REST APIs supporting operational dashboards and business workflows.',
        'Implemented API validation, authentication flows, backend integrations and Angular frontend connectivity for production features.',
      ],
    },
    {
      id: 'atl',
      role: 'Operations Analytics Specialist',
      location: 'Remote',
      bullets: [
        'Developed dashboards and automation tools that improved operational workflows by 15%; supported AWS-based infrastructure and internal operational systems.',
      ],
    },
  ],

  experienceStackLabel: 'stack',

  currently: {
    updated: 'Updated September 2026',
    items: [
      {
        id: 'variance',
        label: 'Variance decomposition',
        detail: "Measured how model, harness, and task choices drive agent cost and reliability.",
      },
      {
        id: 'intervention',
        label: 'Intervention experiments',
        detail: "Tested whether stronger models fix failures; rejected changes that didn't help.",
      },
      {
        id: 'localization',
        label: 'Failure localization',
        detail: 'Classified agent failures as model-side, harness-side, or environment-side using rollout traces.',
      },
    ],
  },

  projects: [
    {
      slug: 'novaretail',
      title: 'NovaRetail',
      summary: 'Enterprise AI investigation platform combining business data with a document knowledge corpus.',
      problem:
        'Enterprise questions could not be answered from structured business data and internal documentation at the same time, so analysts had to reconcile Postgres records and PDF evidence manually.',
      role:
        'Built the end-to-end pipeline: PDF ingestion, page-aware chunking, embeddings, pgvector retrieval, citation-grounded RAG, LangGraph investigation, controlled tool calling and the React interface.',
      metrics: [
        { id: 'corpus', label: 'Document corpus' },
        { id: 'grounding', label: 'Grounding' },
      ],
      compare: {
        before: [
          'Analysts reconciled Postgres records and PDF evidence by hand',
          'Answering meant checking business data and internal docs separately',
        ],
        after: [
          'Citation-grounded RAG across the document corpus',
          'Automated investigation pipeline with controlled tool calling',
        ],
      },
    },
    {
      slug: 'business-ops-agent',
      title: 'AI Business Operations Agent',
      summary: 'Turns natural-language requests into deterministic execution plans across business systems.',
      problem:
        'Business requests across sales, inventory, customer analytics and policy arrived as free text, and executing them safely required authorization, isolation and auditability.',
      role:
        'Engineered a centralized Tool Gateway with JWT/RBAC, capability-based access control, account/store isolation, secure credentials, strict GET-only integrations, retries, timeouts, rate limits and partial-failure handling. Reduced unnecessary AI execution through zero-LLM analytics, bounded RAG/LLM synthesis, context controls, RAG caching and parallel execution.',
      metrics: [
        { id: 'tests', label: 'Automated tests' },
        { id: 'prodEvals', label: 'Production-path evaluations' },
        { id: 'ragEvals', label: 'RAG evaluations' },
      ],
      compare: {
        before: [
          'Requests arrived as free text across four business systems',
          'Safe execution needed authorization, isolation and an audit trail',
        ],
        after: [
          'Deterministic execution plans through a Tool Gateway',
          'JWT/RBAC, capability control, rate limits and partial-failure handling',
        ],
      },
    },
    {
      slug: 'agent-harness',
      title: 'AI Agent Harness / Runtime',
      summary: 'A controlled runtime that separates model reasoning from tools, state and permissions.',
      problem: 'Unconstrained agent execution makes failures non-reproducible and production incidents impossible to replay or verify.',
      role:
        'Implemented a Task → Plan → Execute → Observe → Verify loop with persistent sessions, retries, failure recovery and bounded execution. Integrated MCP with native tools and APIs, adding execution tracing, replayable sessions, verification gates and sandboxed operations.',
      metrics: [{ id: 'loop', label: 'Execution loop' }],
      compare: {
        before: [
          'Unconstrained agent runs made failures non-reproducible',
          'Production incidents could not be replayed or verified',
        ],
        after: [
          'Task → Plan → Execute → Observe → Verify with bounded execution',
          'Replayable sessions with execution tracing and verification gates',
        ],
      },
    },
  ],

  education: [
    { id: 'mtech-cs', degree: 'M.Tech, Computer Science', detail: 'Part-time' },
    { id: 'btech-cse', degree: 'B.Tech, Computer Science & Engineering', detail: '' },
  ],

  /**
   * The narrative spine of the site, built only from CV facts. Each chapter
   * is one role, so the scroll reads as a career rather than a list.
   */
  story: {
    label: 'How I got here',
    hint: 'Scroll to move through the chapters',
    chapters: [
      {
        id: 'atl',
        phase: 'Chapter 01',
        period: '2023 — 2025',
        headline: 'Operations analytics taught me to measure before I build.',
        body: 'I started on dashboards and automation for a heavy-haul operation, supporting AWS infrastructure and internal systems. A 15% improvement in operational workflows was the first proof that a change I shipped actually moved a number.',
        metrics: [
          { id: 'improve', value: '15%', label: 'workflow improvement' },
          { id: 'stack', value: 'AWS', label: 'infrastructure supported' },
        ],
      },
      {
        id: 'presage',
        phase: 'Chapter 02',
        period: '2025 — 2026',
        headline: 'Then I learned the craft of shipping software properly.',
        body: 'At Presage Insights I built and maintained Node.js/Express REST APIs behind operational dashboards, and handled validation, authentication, backend integrations and Angular connectivity for production features. This is where I learned interfaces, contracts and release discipline.',
        metrics: [
          { id: 'api', value: 'REST', label: 'APIs built and maintained' },
          { id: 'ui', value: 'Angular', label: 'frontend connectivity' },
        ],
      },
      {
        id: 'webvory',
        phase: 'Chapter 03',
        period: '2026 — now',
        headline: 'Now I build AI systems that have to survive production.',
        body: 'At Webvory I design LangGraph multi-agent workflows, build LLM evaluation frameworks, and ship RAG systems backed by numbers: 20/20 RAG evaluations, 24/24 production-path evaluations, 41,000+ products reconciled, and a 185-scenario knowledge base across WhatsApp, Gmail and Freshdesk.',
        metrics: [
          { id: 'eval', value: '24/24', label: 'production-path evals' },
          { id: 'products', value: '41,000+', label: 'products reconciled' },
          { id: 'support', value: '185', label: 'support scenarios' },
        ],
      },
    ],
  },

  skills: {
    levelLabel: 'Level',
    xpToNext: '{xp}/100 XP to level {next}',
    technologiesAndCategories: '{technologies} technologies · {categories} categories',
    radarHint: 'hover a card to trace it on the radar',
    inCategory: '{count} in category',
  },

  gamify: {
    firstScroll: { title: 'Signal received', detail: 'Scrolled into the mission' },
    projects: { title: 'Case study opened', detail: 'NovaRetail investigation pipeline' },
    skills: { title: 'Stack mapped', detail: '9 categories, 54 technologies' },
    contact: { title: 'Transmit ready', detail: 'Comms channel is open' },
    konami: { title: 'Operator', detail: 'Konami sequence accepted — disco mode' },
    plain: { title: 'Recruiter view', detail: 'Effects reduced to the essentials' },
  },
}
