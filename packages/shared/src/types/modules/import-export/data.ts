import { system_values } from '@shared/constants/system-values'
import { validate_date_newer_than_epoch } from '@shared/utils/validate-date-newer-than-epoch'
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
  url: z.string().max(2000).url(),
  site_path: z.string().trim().max(150).optional(),
  open_snapshot: z.boolean().optional(),
  is_pinned: z.boolean().optional(),
  pin_order: z.number().int().optional(),
})
const private_link_schema = z.object({
  is_public: z.literal(false),
  hash: z.string().length(64),
  url_aes: z.string().max(3000),
  site_aes: z.string().max(300),
  open_snapshot: z.boolean().optional(),
  is_pinned: z.boolean().optional(),
  pin_order: z.number().int().optional(),
  favicon_aes: z.string().optional(),
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
  created_at: z.string().datetime().refine(validate_date_newer_than_epoch, {
    message: 'Date must be newer than the epoch (1970-01-01T00:00:00Z).',
  }), // TODO make optional
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
  cover: z.string().optional(),
  cover_aes: z.string().optional(),
})
export namespace TagHierarchy {
  const base_tag_hierarchy_schema = z.object({
    hash: z.string().length(64),
  })
  export type TagHierarchyNode = z.infer<typeof base_tag_hierarchy_schema> & {
    children: TagHierarchyNode[]
  }
  export const tag_hierarchy_schema: z.ZodType<TagHierarchyNode> =
    base_tag_hierarchy_schema.extend({
      children: z.lazy(() => tag_hierarchy_schema.array().max(100)),
    })
}
export const data_schema = z.object({
  bookmarks: z.array(bookmark_schema).max(200000),
  tag_hierarchies: z.array(TagHierarchy.tag_hierarchy_schema).max(100),
})
