export type Bookmark_Entity = {
  id: string
  title: string
  note?: string
  created_at: string
  updated_at: string
  visited_at: string
  tags: { name: string; id: number }[]
  links: { url: string; public_saves: number; site_path?: string }[]
  is_public: boolean
  is_starred: boolean
  is_nsfw: boolean
  render_height?: number
}
