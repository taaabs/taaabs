import { TagHierarchyNode_Entity } from '../entities/tag-hierarchy-node.entity'

export type UpdateTagHierarchies_Params = {
  tree: TagHierarchyNode_Entity[]
  starred_only?: boolean
  unread_only?: boolean
  is_archived?: boolean
  gte?: number
  lte?: number
}
