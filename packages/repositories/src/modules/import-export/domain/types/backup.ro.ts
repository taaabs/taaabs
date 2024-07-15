import { Bookmark_Entity } from '../entites/bookmark.entity'

type TagHierarchy = {
  name: string
  children: TagHierarchy[]
}

export type Backup_Ro = {
  bookmarks: Bookmark_Entity[]
  tag_hierarchies: TagHierarchy[]
}
