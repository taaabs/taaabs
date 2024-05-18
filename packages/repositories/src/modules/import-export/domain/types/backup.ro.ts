import { Bookmark_Entity } from '../entites/bookmark.entity'

type TagHierarchy = {
  hash: string
  children: TagHierarchy[]
}

export type Backup_Ro = {
  bookmarks: Bookmark_Entity[]
  tag_hierarchies: TagHierarchy[]
}
