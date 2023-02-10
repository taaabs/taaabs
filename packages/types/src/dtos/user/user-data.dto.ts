import { bookmarkSchema } from 'common/bookmark'
import { collectionSchema } from 'common/collection'
import { z } from 'zod'

export const userDataSchema = z.object({
  collections: z.array(collectionSchema),
  bookmarks: z.array(bookmarkSchema),
})

export type UserDataDto = z.infer<typeof userDataSchema>
