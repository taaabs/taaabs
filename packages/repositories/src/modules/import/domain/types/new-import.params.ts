import { Bookmark_Entity } from '../entites/bookmark.entity'
import { TagHierarchyNode_Entity } from '../entites/tag-hierarchy-node.entity'

export type NewImport_Params = {
  bookmarks: Bookmark_Entity[]
  tree: TagHierarchyNode_Entity[]
}
