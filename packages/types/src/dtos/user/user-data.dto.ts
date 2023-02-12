import { z } from 'zod'

export const bookmarkSchema = z.object({
  siteName: z.string(),
  url: z.string(),
  title: z.string(),
  description: z.string(),
  collectionIds: z.array(z.string()),
})

export type Bookmark = z.infer<typeof bookmarkSchema>

export const collectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.nullable(z.string()),
})

export type Collection = z.infer<typeof collectionSchema>

export const userDataSchema = z.object({
  collections: z.array(collectionSchema),
  bookmarks: z.array(bookmarkSchema),
})

export type UserDataDto = z.infer<typeof userDataSchema>
