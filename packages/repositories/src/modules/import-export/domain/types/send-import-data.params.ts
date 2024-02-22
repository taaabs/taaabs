import { z } from 'zod'
import { bookmark_entity_schema } from '../entites/bookmark.entity'
import { tag_hierarchy_node_entity_schema } from '../entites/tag-hierarchy-node.entity'

export const send_import_data_params_schema = z.object({
  bookmarks: z.array(bookmark_entity_schema),
  tree: z.array(tag_hierarchy_node_entity_schema),
})

export type SendImportData_Params = z.infer<
  typeof send_import_data_params_schema
>
