export type Bookmark_Entity = {
  id: number
  is_public: boolean
  title?: string
  note?: string
  created_at: string
  updated_at: string
  visited_at: string
  tags: { name: string; id: number; is_public?: boolean }[]
  links: {
    url: string
    saves?: number
    site_path?: string
    is_public: boolean
    is_pinned?: boolean
    pin_title?: string
    via_wayback?: boolean
  }[]
  is_unread: boolean
  stars: number
  render_height?: number
  is_compact?: boolean
  points?: number
}
