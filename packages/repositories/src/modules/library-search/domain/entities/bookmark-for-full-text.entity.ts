export type SearchableBookmarkForFullText_Entity = {
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
  is_unsorted?: boolean
  is_deleted?: boolean
  stars: number
  points: number
}
