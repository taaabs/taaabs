export type Month_Entity = {
  tags: Record<string, { id: number; yields: number }>
  bookmark_count: number
  starred_count?: number
  nsfw_count?: number
}
