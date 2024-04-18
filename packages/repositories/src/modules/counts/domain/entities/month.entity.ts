export type Month_Entity = {
  tags: Record<string, { name: string; yields: number }>
  bookmark_count: number
  starred_count?: number
  unread_count?: number
}
