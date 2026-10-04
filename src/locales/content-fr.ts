import type { ContentOverride } from '../content/content-types'

export const contentFr: ContentOverride = {
  profile: {
    role: 'Développeur Full-Stack IA',
    tagline: 'Python · React · GenAI · RAG · IA agentique',
    summaryLead: 'Développeur Full-Stack IA spécialisé dans la création d’applications de bout en bout.',
    summaryRest:
      'Je combine les capacités de l’IA avec des services backend fiables, des bases de données, des API et des interfaces web modernes — en conduisant les produits IA de la conception des workflows et de l’intégration des données jusqu’à l’évaluation, la sécurité et le déploiement en production, avec un accent sur des applications métier fiables et mesurables.',
    availability: 'Ouvert aux opportunités',
    location: 'Mohali, Pendjab, Inde',
    outcomes: [
      { id: 'inference', value: '−45%', label: 'inférence en production avec ONNX + TensorRT' },
      { id: 'uptime', value: '<15ms', label: 'disponibilité du service derrière des portes CI/CD' },
      { id: 'ner', value: '99.9%', label: 'F1 sur la NER d’extraction d’adresses' },
    ],
  },

  hero: {
    roles: [
      'Développeur Full-Stack IA',
      'Systèmes RAG et agentiques',
      'Ingénierie FastAPI + React',
      'Évaluation et observabilité des LLM',
    ],
    buildRows: [
      { id: 'rag', label: 'Systèmes RAG', detail: 'pgvector · recherche hybride · reranking' },
      { id: 'agents', label: 'Workflows multi-agents', detail: 'LangGraph · appel d’outils · MCP' },
      { id: 'gateway', label: 'Passerelle d’outils et sécurité', detail: 'JWT/RBAC · garde-fous · tracing' },
      { id: 'inventory', label: 'Intelligence des stocks', detail: 'données structurées + workflows IA' },
      { id: 'support', label: 'Automatisation du support', detail: 'WhatsApp · Gmail · Freshdesk' },
    ],
    telemetry: [
      { id: 'ragEval', label: 'Évaluations RAG', value: '20/20 réussies' },
      { id: 'prodPaths', label: 'Chemins de production', value: '24/24 réussis' },
      { id: 'tests', label: 'Tests automatisés', value: '156 passants' },
    ],
    console: {
      title: 'Système IA / Cœur',
      state: 'En ligne',
      coreLabel: 'Cœur IA',
      capabilities: 'Capacités',
      telemetry: 'Télémétrie système',
      activity: 'Activité',
      lines: [
        { id: 'sessions', text: 'sessions persistées · retries · reprise sur échec' },
        { id: 'tracing', text: "traces d'exécution · sessions rejouables · gates de vérification" },
        { id: 'sandbox', text: 'exécution d’outils sandboxée · accès par capacité' },
        { id: 'guardrails', text: 'garde-fous · défense prompt-injection · rate limits' },
      ],
    },
  },

  stats: [
    { id: 'years', label: 'Années en IA et logiciel' },
    { id: 'areas', label: 'Domaines de compétences' },
    { id: 'systems', label: 'Systèmes IA de bout en bout' },
    { id: 'stages', label: 'Étapes d’exécution agentique' },
  ],

  snapshot: {
    title: 'Instantané système',
    state: 'Lecture seule',
    heading: 'Les systèmes derrière le travail.',
    tags: [
      { id: 'years', text: 'Trace' },
      { id: 'areas', text: 'Matrice' },
      { id: 'systems', text: 'Graphe' },
      { id: 'stages', text: 'Pipeline' },
    ],
  },

  skillGroups: [
    { id: 'languages', label: 'Programmation & Données' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'databases', label: 'Bases de données' },
    { id: 'genai', label: 'IA générative' },
    { id: 'rag', label: 'RAG & IA agentique' },
    { id: 'ml', label: 'ML / DL / NLP' },
    { id: 'engineering', label: 'Ingénierie IA' },
    { id: 'deployment', label: 'Déploiement & Outils' },
  ],

  experience: [
    {
      id: 'webvory',
      role: 'Ingénieur IA',
      location: 'Mohali, Inde',
      bullets: [
        'Conçu des workflows multi-agents basés sur LangGraph pour la génération de campagnes et le reporting opérationnel, en coordonnant le raisonnement IA, les outils métier, les workflows structurés et l’exécution automatisée.',
        'Construit un framework d’évaluation LLM avec GPT-4o pour évaluer les contenus générés, valider le comportement des workflows et assurer le suivi de la qualité des applications IA.',
        'Développé un système d’intelligence des stocks rapprochant plus de 41 000 produits de 57 fournisseurs, en reliant les données produits structurées aux workflows opérationnels pilotés par l’IA.',
        'Construit un système de support multicanal basé sur RAG avec Claude et FAISS, reliant WhatsApp, Gmail et Freshdesk à une base de connaissances de 185 scénarios.',
      ],
    },
    {
      id: 'presage',
      role: 'Développeur logiciel',
      location: 'Noida, Inde',
      bullets: [
        'Développé et maintenu des API REST Node.js/Express soutenant les tableaux de bord opérationnels et les workflows métier.',
        'Implémenté la validation d’API, les flux d’authentification, les intégrations backend et la connectivité du frontend Angular pour des fonctionnalités de production.',
      ],
    },
    {
      id: 'atl',
      role: 'Spécialiste en analytics des opérations',
      location: 'À distance',
      bullets: [
        'Développé des tableaux de bord et des outils d’automatisation qui ont amélioré les workflows opérationnels de 15 % ; soutien à l’infrastructure AWS et aux systèmes internes.',
      ],
    },
  ],

  experienceStackLabel: 'stack',

  projects: [
    {
      slug: 'novaretail',
      title: 'NovaRetail',
      summary: 'Plateforme d’enquête IA d’entreprise combinant données métier et corpus documentaire.',
      problem:
        'Les questions d’entreprise ne pouvaient pas être traitées à partir des données structurées et de la documentation interne en même temps, ce qui obligeait les analystes à rapprocher manuellement les enregistrements Postgres et les preuves PDF.',
      role:
        'Construit toute la chaîne : ingestion PDF, découpage conscient des pages, embeddings, récupération pgvector, RAG fondé sur les citations, enquête LangGraph, appel d’outils contrôlé et interface React.',
      metrics: [
        { id: 'corpus', label: 'Corpus documentaire' },
        { id: 'grounding', label: 'Ancrage' },
      ],
      compare: {
        before: [
          'Les analystes rapprochaient Postgres et les preuves PDF à la main',
          'Répondre exigeait de croiser données métier et documents internes',
        ],
        after: [
          'RAG avec citations sur l’ensemble du corpus documentaire',
          'Pipeline d’enquête automatisé avec appel d’outils contrôlé',
        ],
      },
    },
    {
      slug: 'business-ops-agent',
      title: 'Agent d’opérations IA',
      summary: 'Transforme les demandes en langage naturel en plans d’exécution déterministes.',
      problem:
        'Les demandes commerciales (ventes, stocks, analytique client, politiques) arrivaient en texte libre, et les exécuter en toute sécurité exigeait autorisation, isolation et auditabilité.',
      role:
        'Conçu une passerelle d’outils centralisée avec JWT/RBAC, contrôle d’accès par capability, isolation compte/magasin, identifiants sécurisés, intégrations strictement en lecture, retries, timeouts, rate limits et gestion des échecs partiels. Réduit l’exécution IA inutile grâce à l’analytique sans LLM, la synthèse RAG/LLM bornée, le contrôle du contexte, le cache RAG et l’exécution parallèle.',
      metrics: [
        { id: 'tests', label: 'Tests automatisés' },
        { id: 'prodEvals', label: 'Évaluations en production' },
        { id: 'ragEvals', label: 'Évaluations RAG' },
      ],
      compare: {
        before: [
          'Les demandes arrivaient en texte libre sur quatre systèmes métier',
          'Une exécution sûre exigeait autorisation, isolation et traçabilité',
        ],
        after: [
          'Plans d’exécution déterministes via une passerelle d’outils',
          'JWT/RBAC, contrôle par capacité, quotas et gestion des échecs partiels',
        ],
      },
    },
    {
      slug: 'agent-harness',
      title: 'Runtime / Harness IA',
      summary: 'Un runtime contrôlé qui sépare le raisonnement du modèle des outils, de l’état et des permissions.',
      problem:
        'L’exécution agentique non contrainte rend les pannes non reproductibles et les incidents de production impossibles à rejouer ou vérifier.',
      role:
        'Implémenté une boucle Tâche → Plan → Exécution → Observation → Vérification avec sessions persistantes, retries, reprise après échec et exécution bornée. Intégré MCP avec les outils natifs et les API, ajoutant tracing d’exécution, sessions rejouables, garde-fous de vérification et opérations en bac à sable.',
      metrics: [{ id: 'loop', label: 'Boucle d’exécution' }],
      compare: {
        before: [
          'Des exécutions agentiques non contraintes rendaient les pannes non reproductibles',
          'Les incidents de production ne pouvaient être rejoués ni vérifiés',
        ],
        after: [
          'Boucle Tâche → Plan → Exécution → Observation → Vérification bornée',
          'Sessions rejouables avec tracing d’exécution et garde-fous de vérification',
        ],
      },
    },
  ],

  education: [
    { id: 'mtech-cs', degree: 'M.Tech, Informatique', detail: 'Temps partiel' },
    { id: 'btech-cse', degree: 'B.Tech, Informatique et Génie Logiciel', detail: '' },
  ],

  story: {
    label: 'Comment j’en suis arrivé là',
    hint: 'Faites défiler pour parcourir les chapitres',
    chapters: [
      {
        id: 'atl',
        phase: 'Chapitre 01',
        period: '2023 — 2025',
        headline: 'L’analytique des opérations m’a appris à mesurer avant de construire.',
        body: 'J’ai commencé sur des tableaux de bord et de l’automatisation pour une exploitation de transport lourd, en supportant l’infrastructure AWS et les systèmes internes. Une amélioration de 15 % des processus opérationnels a été la première preuve qu’une modification que j’ai livrée déplaçait réellement un chiffre.',
        metrics: [
          { id: 'improve', value: '15 %', label: 'd’amélioration des processus' },
          { id: 'stack', value: 'AWS', label: 'd’infrastructure supportée' },
        ],
      },
      {
        id: 'presage',
        phase: 'Chapitre 02',
        period: '2025 — 2026',
        headline: 'Ensuite, j’ai appris le métier de livrer du logiciel correctement.',
        body: 'Chez Presage Insights, j’ai construit et maintenu des API REST Node.js/Express derrière des tableaux de bord opérationnels, et pris en charge la validation, l’authentification, les intégrations backend et la connectivité Angular pour des fonctionnalités en production. C’est là que j’ai appris les interfaces, les contrats et la discipline de mise en livraison.',
        metrics: [
          { id: 'api', value: 'REST', label: 'API construites et maintenues' },
          { id: 'ui', value: 'Angular', label: 'de connectivité frontend' },
        ],
      },
      {
        id: 'webvory',
        phase: 'Chapitre 03',
        period: '2026 — aujourd’hui',
        headline: 'Aujourd’hui, je construis des systèmes IA qui doivent survivre à la production.',
        body: 'Chez Webvory, je conçois des workflows multi-agents LangGraph, je construis des frameworks d’évaluation LLM et je livre des systèmes RAG appuyés par des chiffres : 20/20 évaluations RAG, 24/24 évaluations du chemin de production, plus de 41 000 produits rapprochés et une base de connaissances de 185 scénarios couvrant WhatsApp, Gmail et Freshdesk.',
        metrics: [
          { id: 'eval', value: '24/24', label: 'évaluations du chemin de production' },
          { id: 'products', value: '41 000+', label: 'produits rapprochés' },
          { id: 'support', value: '185', label: 'scénarios de support' },
        ],
      },
    ],
  },

  skills: {
    levelLabel: 'Niveau',
    xpToNext: '{xp}/100 XP jusqu’au niveau {next}',
    technologiesAndCategories: '{technologies} technologies · {categories} catégories',
    radarHint: 'survolez une carte pour la tracer sur le radar',
    inCategory: '{count} dans la catégorie',
  },

  gamify: {
    firstScroll: { title: 'Signal reçu', detail: 'Vous avez entré la mission' },
    projects: { title: 'Étude de cas ouverte', detail: 'Pipeline d’enquête NovaRetail' },
    skills: { title: 'Stack cartographiée', detail: '9 catégories, 54 technologies' },
    contact: { title: 'Prêt à transmettre', detail: 'Le canal de communication est ouvert' },
    konami: { title: 'Opérateur', detail: 'Séquence Konami acceptée — mode disco' },
    plain: { title: 'Vue recruteur', detail: 'Effets réduits à l’essentiel' },
  },
}
