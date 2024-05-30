import { TagHierarchy_Entity } from '../entities/tag-hierarchy.entity'

export type UpdateTagHierarchies_Params = {
  tag_hierarchies: TagHierarchy_Entity[]
  starred_only?: boolean
  unsorted_only?: boolean
  is_archived?: boolean
  gte?: number
  lte?: number
}
