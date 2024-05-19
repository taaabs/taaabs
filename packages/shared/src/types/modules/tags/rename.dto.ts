import { system_values } from '@shared/constants/system-values'
import { z } from 'zod'

export namespace Rename_Dto {
  export namespace Request {
    export const body_schema = z.object({
      old_hash: z.string().length(64),
      new_hash: z.string().length(64),
      name: z
        .string()
        .min(1)
        .max(system_values.bookmark.tags.max_length)
        .optional(),
      name_aes: z
        .string()
        .max(system_values.bookmark.tags.max_length * 10)
        .optional(),
    })
    export type Body = z.infer<typeof body_schema>
  }
}
