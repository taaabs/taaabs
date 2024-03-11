import { z } from 'zod'

export namespace ListBackups_Dto {
  export const response_schema = z.array(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      created_at: z.string().datetime(),
    }),
  )
  export type Response = z.infer<typeof response_schema>
}
