export type SearchableBookmark_Entity = {
  id: number
  title?: string
  note?: string
  tags: { id: number; name: string }[]
  links: {
    site: string
    plain_text?: string
  }[]
  created_at: number
  updated_at: number
  visited_at?: number
  is_unread?: boolean
  stars: number
  points: number
}
