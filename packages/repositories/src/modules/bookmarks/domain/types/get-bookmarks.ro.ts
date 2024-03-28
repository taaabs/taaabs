import { Pagination } from '@repositories/core/pagination'
import { Bookmark_Entity } from '../entities/bookmark.entity'

export type GetBookmarks_Ro = {
  bookmarks?: Bookmark_Entity[]
  processing_progress?: number
  import_progress?: number
} & Pagination
