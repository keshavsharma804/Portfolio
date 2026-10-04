/**
 * Shape of every piece of portfolio copy that must change with the language.
 *
 * `profile.ts` holds the English source of truth. Other locales provide a
 * `DeepPartial` of this shape and are merged over it, so a locale that only
 * translates part of the site still renders — the rest falls back to English
 * instead of showing a raw key.
 *
 * Every array element that can be partially translated carries a stable `id`
 * so merges line up regardless of ordering.
 */
export type ContentBundle = {
  profile: {
    role: string
    tagline: string
    /** First line of the About statement, set apart as the lead. */
    summaryLead: string
    /** Supporting paragraph under the About lead. */
    summaryRest: string
    availability: string
    location: string
    /**
     * Headline results, shown as cards under the About statement. Values are
     * written as authored (including a leading minus sign or a `<` bound) so
     * nothing is reformatted away from what was actually measured.
     */
    outcomes: { id: string; value: string; label: string }[]
  }
  hero: {
    roles: string[]
    buildRows: { id: string; label: string; detail: string; metric: string }[]
    telemetry: { id: string; label: string; value: string }[]
    /**
     * Labels for the mission-control console in the right-hand column.
     *
     * `lines` is the console log: short statements of what the systems in
     * `buildRows` actually do, not a feed of events, because nothing here is
     * connected to a live machine.
     */
    console: {
      title: string
      state: string
      coreLabel: string
      capabilities: string
      telemetry: string
      activity: string
      lines: { id: string; text: string }[]
    }
  }
  stats: { id: string; label: string }[]
  /**
   * Copy for the telemetry surface the headline metrics sit in.
   *
   * `state` describes the surface rather than a machine: these are the same
   * four figures from the CV, so the panel reports a snapshot and nothing is
   * connected to anything live. `tags` name each module's drawing — track,
   * matrix, graph, pipeline — so the visual can be identified by one word
   * instead of a caption paragraph.
   */
  snapshot: {
    title: string
    state: string
    heading: string
    tags: { id: string; text: string }[]
  }
  skillGroups: { id: string; label: string }[]
  experience: {
    id: string
    role: string
    location: string
    bullets: string[]
  }[]
  /** Label used by the terminal before each stack line. */
  experienceStackLabel: string
  /**
   * Short, dated snapshot of present work. Deliberately small: it is the first
   * thing on the page to go stale, so it carries an explicit `updated` stamp.
   */
  currently: {
    updated: string
    items: { id: string; label: string; detail: string }[]
  }
  projects: {
    slug: string
    title: string
    summary: string
    problem: string
    role: string
    /**
     * Optional before/after lines for the draggable comparison slider. Kept
     * short on purpose — the component renders them inside a fixed-height box.
     * Omit this and the project simply shows no comparison.
     */
    compare?: { before: string[]; after: string[] }
    metrics: { id: string; label: string }[]
  }[]
  education: { id: string; degree: string; detail: string }[]
  story: {
    label: string
    hint: string
    chapters: {
      id: string
      phase: string
      period: string
      headline: string
      body: string
      metrics: { id: string; value: string; label: string }[]
    }[]
  }
  skills: {
    levelLabel: string
    xpToNext: string
    technologiesAndCategories: string
    radarHint: string
    inCategory: string
  }
  gamify: Record<string, { title: string; detail: string }>
}

export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T

export type ContentOverride = DeepPartial<ContentBundle>

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Merges a locale override onto the English base.
 *
 * Objects merge key-by-key. Arrays merge element-by-element when the elements
 * carry a stable `id` or `slug`, so a locale can retitle one project without
 * restating the rest of the list. Arrays of plain strings replace wholesale.
 */
const ID_KEYS = ['id', 'slug'] as const

/**
 * Reads the merge key of an object array element, or `undefined` for anything
 * that is not an object or carries no stable identifier.
 */
function keyOf(value: unknown): string | undefined {
  if (!isPlainObject(value)) return undefined
  for (const key of ID_KEYS) {
    const candidate = value[key]
    if (typeof candidate === 'string' && candidate.length > 0) return candidate
  }
  return undefined
}

function mergeValue(base: unknown, override: unknown): unknown {
  if (override === undefined) return base
  if (override === null) return base
  if (Array.isArray(base) && Array.isArray(override)) {
    const key = keyOf(base[0]) ?? keyOf(override[0])
    if (key === undefined) return override
    const patches = new Map(override.map((item) => [keyOf(item), item] as const))
    return base.map((item) => {
      const patch = patches.get(keyOf(item))
      return patch === undefined ? item : mergeValue(item, patch)
    })
  }
  if (isPlainObject(base) && isPlainObject(override)) {
    const result: Record<string, unknown> = { ...base }
    for (const [key, value] of Object.entries(override)) {
      result[key] = mergeValue(base[key], value)
    }
    return result
  }
  return override
}

export function mergeContent(base: ContentBundle, override: ContentOverride): ContentBundle {
  return mergeValue(base, override) as ContentBundle
}
