export type SearchableBookmark_Entity = {
  id: number
  title?: string
  note?: string
  tags: string[]
  sites: string[]
  created_at: number
  updated_at: number
  visited_at: number
  is_unread: boolean
  is_archived: boolean
  stars: number
}
