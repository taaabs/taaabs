import { system_values } from '@shared/constants/system-values'
import { z } from 'zod'

export namespace CreateBookmark_Dto {
  const public_tag_schema = z.object({
    is_public: z.literal(true),
    hash: z.string().length(64),
    name: z.string().trim().min(1).max(system_values.bookmark.tags.max_length),
  })
  const private_tag_schema = z.object({
    is_public: z.literal(false),
    hash: z.string().length(64),
    name_aes: z.string().max(system_values.bookmark.tags.max_length * 10),
  })
  const public_link_schema = z.object({
    is_public: z.literal(true),
    hash: z.string().length(64),
    url: z.string().max(500).url(),
    site_path: z.string().trim().max(150).optional(),
    is_pinned: z.boolean().optional(),
    pin_title: z.string().max(100).optional(),
    via_wayback: z.boolean().optional(),
  })
  const private_link_schema = z.object({
    is_public: z.literal(false),
    hash: z.string().length(64),
    url_aes: z.string().max(1000),
    site_aes: z.string().max(300),
    is_pinned: z.boolean().optional(),
    pin_title_aes: z.string().max(200).optional(),
    via_wayback: z.boolean().optional(),
  })

  export const body_schema = z.object({
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
    created_at: z.string().datetime().optional(),
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

  export type Body = z.infer<typeof body_schema>
}
