import { SearchableBookmark_Entity } from '../entities/searchable-bookmark.entity'

export type GetBookmarks_Ro = {
  bookmarks: SearchableBookmark_Entity[]
  version: number
}
