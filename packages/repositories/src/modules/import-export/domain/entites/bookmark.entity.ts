export type Bookmark_Entity = {
  id?: string
  title?: string
  note?: string
  created_at?: string
  is_public?: boolean
  is_archived?: boolean
  is_unread?: boolean
  stars?: number
  tags?: { name: string; is_public?: boolean }[]
  links?: {
    url: string
    site_path?: string
    is_public?: boolean
    is_pinned?: boolean
    pin_order?: number
    pin_title?: string
    open_snapshot?: boolean
  }[]
}
