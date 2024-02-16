type Tag = {
  name: string
  is_public?: boolean
}

type Link = {
  url: string
  site_path?: string
  is_public?: boolean
}

export type Bookmark_Entity = {
  id?: string
  title?: string
  note?: string
  created_at: string
  visited_at?: string
  is_public?: boolean
  is_archived?: boolean
  is_unread?: boolean
  stars?: number
  tags: Tag[]
  links: Link[]
}
