import { system_values } from '@shared/constants/system-values'
import { z } from 'zod'

export const bookmark_entity_schema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional(),
  note: z.string().optional(),
  created_at: z.string().datetime().optional(),
  is_public: z.boolean().optional(),
  is_archived: z.boolean().optional(),
  is_unread: z.boolean().optional(),
  stars: z.number().int().min(0).max(5).optional(),
  tags: z
    .array(
      z.object({
        name: z.string(),
        is_public: z.boolean().optional(),
      }),
    )
    .max(system_values.bookmark.tags.limit)
    .optional(),
  links: z
    .array(
      z.object({
        url: z.string(),
        site_path: z.string().optional(),
        is_public: z.boolean().optional(),
      }),
    )
    .max(system_values.bookmark.links.limit)
    .optional(),
})

export type Bookmark_Entity = z.infer<typeof bookmark_entity_schema>
