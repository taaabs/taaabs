import { z } from 'zod'

const base_tag_hierarchy_node_entity_schema = z.object({
  hash: z.string().length(64),
})
type TagHierarchyNode = z.infer<
  typeof base_tag_hierarchy_node_entity_schema
> & {
  children: TagHierarchyNode[]
}
export const tag_hierarchy_node_entity_schema: z.ZodType<TagHierarchyNode> =
  base_tag_hierarchy_node_entity_schema.extend({
    children: z.lazy(() => tag_hierarchy_node_entity_schema.array()),
  })

export type TagHierarchyNode_Entity = z.infer<
  typeof tag_hierarchy_node_entity_schema
>
