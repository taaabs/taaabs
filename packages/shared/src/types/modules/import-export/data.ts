import { system_values } from '@shared/constants/system-values'
import { z } from 'zod'

const public_tag_schema = z.object({
  is_public: z.literal(true),
  hash: z.string().length(64),
  name: z.string().trim().min(1).max(50),
})
const private_tag_schema = z.object({
  is_public: z.literal(false),
  hash: z.string().length(64),
  name_aes: z.string().min(44).max(64),
})
const public_link_schema = z.object({
  is_public: z.literal(true),
  hash: z.string().length(64),
  url: z.string().max(500).url(),
  site_path: z.string().trim().max(150).optional(),
})
const private_link_schema = z.object({
  is_public: z.literal(false),
  hash: z.string().length(64),
  url_aes: z.string().max(1000),
  site_aes: z.string().max(100),
})
export const bookmark_schema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().max(system_values.bookmark.title.max_length).optional(),
  title_aes: z
    .string()
    .max(system_values.bookmark.title.max_length * 2)
    .optional(),
  note: z.string().max(system_values.bookmark.note.max_length).optional(),
  note_aes: z
    .string()
    .max(system_values.bookmark.note.max_length * 2)
    .optional(),
  created_at: z.string().datetime(), // TODO make optional
  is_public: z.boolean().optional(),
  is_archived: z.boolean().optional(),
  stars: z.number().int().min(0).max(5).optional(),
  is_unread: z.boolean().optional(),
  tags: z
    .array(
      z.discriminatedUnion('is_public', [
        public_tag_schema,
        private_tag_schema,
      ]),
    )
    .max(system_values.bookmark.tags.limit)
    .optional(),
  links: z
    .array(
      z.discriminatedUnion('is_public', [
        public_link_schema,
        private_link_schema,
      ]),
    )
    .max(system_values.bookmark.links.limit)
    .optional(),
})
namespace TagHierarchy {
  const base_tag_hierarchy_schema = z.object({
    hash: z.string().length(64),
  })
  type TagHierarchyNode = z.infer<typeof base_tag_hierarchy_schema> & {
    children: TagHierarchyNode[]
  }
  export const tag_hierarchy_schema: z.ZodType<TagHierarchyNode> =
    base_tag_hierarchy_schema.extend({
      children: z.lazy(() => tag_hierarchy_schema.array().max(100)),
    })
}
export const data_schema = z.object({
  bookmarks: z.array(bookmark_schema).max(200000),
  tree: z.array(TagHierarchy.tag_hierarchy_schema).max(100),
})