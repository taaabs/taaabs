import { z } from 'zod'

export namespace RequestNewBackup_Dto {
  export const body_schema = z.object({
    name: z.string().max(100).optional(),
  })
  export type Body = z.infer<typeof body_schema>
}
