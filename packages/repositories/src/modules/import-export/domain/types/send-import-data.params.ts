import { Bookmark_Entity } from '../entites/bookmark.entity'
import { TagHierarchy_Entity } from '../entites/tag-hierarchy.entity'

export type SendImportData_Params = {
  bookmarks: Bookmark_Entity[]
  tag_hierarchies: TagHierarchy_Entity[]
  erase_library?: boolean
}
