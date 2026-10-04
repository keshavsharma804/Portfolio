/** Skill level for a category: every two technologies is one level. */
export function skillLevel(count: number) {
  return Math.max(1, Math.ceil(count / 2))
}
