export type Project = {
  slug: string
  stack: string[]
  links: { label: string; href: string }[]
  metrics: { id: string; value: string }[]
  featured: boolean
}

export type ExperienceEntry = {
  id: string
  company: string
  start: string
  end: string | null
  stack: string[]
}

export type EducationEntry = {
  id: string
  institution: string
  start: string
  end: string | null
}

export type SkillGroup = {
  id: string
  items: string[]
}

/**
 * Structural portfolio data: identity, links, ordering, tech names and dates.
 *
 * Anything a reader-facing sentence needs lives in `content-en.ts` and the
 * locale overrides, so it can actually be translated. Tech names, company
 * names and metric values stay here because they are proper nouns or figures.
 */
export const profile = {
  name: 'Keshav Sharma',
  initials: 'KS',
  cv: { file: '/cv.pdf', label: 'Curriculum Vitae' },
  email: 'sharmakeshav364@gmail.com',
  phone: '+91 88473 71175',
  links: {
    email: 'mailto:sharmakeshav364@gmail.com',
    github: 'https://github.com/keshavsharma804',
    linkedin: 'https://www.linkedin.com/in/keshav-sharma99/',
    website: '',
  },
} as const

export const navItems = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'currently', label: 'Currently', href: '#currently' },
  { id: 'education', label: 'Education', href: '#education' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

/** Numeric values only — the labels are translated in the content bundle. */
export const stats = [
  { id: 'years', value: '2+' },
  { id: 'areas', value: '9' },
  { id: 'systems', value: '3' },
  { id: 'stages', value: '5' },
]

/** Tech names are proper nouns and stay untranslated. */
export const skillGroups: SkillGroup[] = [
  { id: 'languages', items: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'NumPy', 'Pandas'] },
  { id: 'frontend', items: ['React', 'HTML', 'CSS', 'REST API Integration'] },
  { id: 'backend', items: ['FastAPI', 'REST APIs', 'Pydantic', 'SQLAlchemy', 'Async Programming', 'Node.js', 'Express'] },
  { id: 'databases', items: ['PostgreSQL', 'Redis', 'SQLite', 'pgvector', 'FAISS'] },
  { id: 'genai', items: ['LLMs', 'Prompt Engineering', 'Context Engineering', 'Structured Outputs', 'Tool Calling', 'OpenAI API', 'Anthropic Claude API'] },
  { id: 'rag', items: ['RAG', 'Vector Search', 'Hybrid Search', 'Reranking', 'LangGraph', 'LangChain', 'Multi-Agent Systems', 'MCP'] },
  { id: 'ml', items: ['Scikit-learn', 'Feature Engineering', 'Model Evaluation', 'PyTorch', 'NLP', 'Transformers'] },
  { id: 'engineering', items: ['LLM Evaluation', 'RAG Evaluation', 'Observability', 'Tracing', 'Prompt Injection Defense', 'LLM Guardrails'] },
  { id: 'deployment', items: ['Docker', 'Docker Compose', 'AWS', 'Git', 'CI/CD'] },
]

export const experience: ExperienceEntry[] = [
  {
    id: 'webvory',
    company: 'Webvory',
    start: 'Mar 2026',
    end: null,
    stack: ['LangGraph', 'GPT-4o', 'Claude', 'FAISS', 'RAG', 'Python'],
  },
  {
    id: 'presage',
    company: 'Presage Insights',
    start: 'Aug 2025',
    end: 'Mar 2026',
    stack: ['Node.js', 'Express', 'REST', 'Angular'],
  },
  {
    id: 'atl',
    company: 'ATL Heavy Haul Inc.',
    start: 'Nov 2023',
    end: 'Mar 2025',
    stack: ['Dashboards', 'Automation', 'AWS'],
  },
]

export const projects: Project[] = [
  {
    slug: 'novaretail',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'LangGraph', 'RAG', 'React', 'Docker'],
    links: [],
    metrics: [
      { id: 'corpus', value: '8' },
      { id: 'grounding', value: 'Citation-based' },
    ],
    featured: true,
  },
  {
    slug: 'business-ops-agent',
    stack: ['Python', 'FastAPI', 'LangGraph', 'RAG', 'FAISS', 'SQLite', 'Shopify', 'Freshdesk', 'ShipStation'],
    links: [],
    metrics: [
      { id: 'tests', value: '156' },
      { id: 'prodEvals', value: '24/24' },
      { id: 'ragEvals', value: '20/20' },
    ],
    featured: true,
  },
  {
    slug: 'agent-harness',
    stack: ['Python', 'FastAPI', 'LLMs', 'MCP', 'Sandboxing', 'Tool Orchestration'],
    links: [],
    metrics: [{ id: 'loop', value: '5 stages' }],
    featured: true,
  },
]

export const education: EducationEntry[] = [
  {
    id: 'mtech-cs',
    institution: 'Punjabi University',
    start: '2023',
    end: '2026',
  },
  {
    id: 'btech-cse',
    institution: 'Maharaja Ranjit Singh University',
    start: '2018',
    end: '2022',
  },
]
