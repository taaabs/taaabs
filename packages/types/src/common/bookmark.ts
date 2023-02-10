import { z } from 'zod'

export const bookmarkSchema = z.object({
  url123: z.string(),
  title: z.string(),
  description: z.string(),
  collectionId: z.string(),
})

export type Bookmark = z.infer<typeof bookmarkSchema>
