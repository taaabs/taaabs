type Tag = {
  name?: string
  name_aes?: string
}

type Link = {
  is_public?: boolean
  url?: string
  site_path?: string
  url_aes?: string
  site_aes?: string
  is_pinned?: boolean
  pin_order?: number
  pin_title?: string
  pin_title_aes?: string
  open_snapshot?: boolean
}

export type Bookmark = {
  id: string
  title?: string
  title_aes?: string
  note?: string
  note_aes?: string
  created_at: string // TODO make optional
  views: number
  is_public?: boolean
  is_archived?: boolean
  stars?: number
  is_unsorted?: boolean
  tags: Tag[]
  links: Link[]
}

export type TagHierarchy = {
  name?: string
  name_aes?: string
  children: TagHierarchy[]
}

export type ExportData = {
  bookmarks: Bookmark[]
  tag_hierarchies: TagHierarchy[]
}
