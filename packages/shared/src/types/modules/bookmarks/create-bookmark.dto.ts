import { system_values } from '../../../../src/constants/system-values'
import { validate_date_newer_than_epoch } from '../../../../src/utils/validate-date-newer-than-epoch'
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
    url: z.string().max(2000).url(),
    site_path: z.string().trim().max(150).optional(),
    is_pinned: z.boolean().optional(),
    pin_title: z.string().max(100).optional(),
    open_snapshot: z.boolean().optional(),
  })
  const private_link_schema = z.object({
    is_public: z.literal(false),
    hash: z.string().length(64),
    url_aes: z.string().max(3000),
    site_aes: z.string().max(300),
    is_pinned: z.boolean().optional(),
    pin_title_aes: z.string().max(200).optional(),
    open_snapshot: z.boolean().optional(),
  })

  export const body_schema = z.object({
    title: z
      .string()
      .max(system_values.bookmark.title.max_length)
      .optional()
      .nullable(),
    title_aes: z
      .string()
      .max(system_values.bookmark.title.max_length * 2)
      .optional()
      .nullable(),
    note: z.string().max(system_values.bookmark.note.max_length).optional().nullable(),
    note_aes: z
      .string()
      .max(system_values.bookmark.note.max_length * 2)
      .optional().nullable(),
    created_at: z
      .string()
      .datetime()
      .refine(validate_date_newer_than_epoch, {
        message: 'Date must be newer than the epoch (1970-01-01T00:00:00Z).',
      })
      .optional(),
    is_public: z.boolean().optional(),
    is_archived: z.boolean().optional(),
    stars: z.number().int().min(0).max(5).optional().nullable(),
    is_unsorted: z.boolean().optional().nullable(),
    tags: z
      .array(
        z.discriminatedUnion('is_public', [
          public_tag_schema,
          private_tag_schema,
        ]),
      )
      .max(system_values.bookmark.tags.limit)
      .optional().nullable(),
    links: z
      .array(
        z.discriminatedUnion('is_public', [
          public_link_schema,
          private_link_schema,
        ]),
      )
      .max(system_values.bookmark.links.limit)
      .optional().nullable(),
  })

  export type Body = z.infer<typeof body_schema>
}
