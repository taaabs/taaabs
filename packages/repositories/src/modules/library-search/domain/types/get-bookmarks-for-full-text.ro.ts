import { SearchableBookmarkForFullText_Entity } from '../entities/bookmark-for-full-text.entity'

export type GetBookmarksForFullText_Ro = {
  bookmarks: SearchableBookmarkForFullText_Entity[]
  version: number
}
