type Tag = {
  name?: string
  name_aes?: string
}

type Link = {
  url?: string
  site_path?: string
  url_aes?: string
  site_aes?: string
}

export type Bookmark = {
  id: string
  title?: string
  title_aes?: string
  note?: string
  note_aes?: string
  created_at: string // TODO make optional
  is_public?: boolean
  is_archived?: boolean
  stars: number
  is_unread?: boolean
  tags: Tag[]
  links: Link[]
}

export type TagHierarchyNode = {
  hash: string
  children: TagHierarchyNode[]
}

export type ExportData = {
  bookmarks: Bookmark[]
  tree: TagHierarchyNode[]
}
