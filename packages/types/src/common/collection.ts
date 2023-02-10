import { z } from 'zod'

export const collectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.nullable(z.string()),
})

export type Collection = z.infer<typeof collectionSchema>
