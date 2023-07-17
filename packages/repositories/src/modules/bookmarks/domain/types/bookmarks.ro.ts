import { Pagination } from '@repositories/core/pagination'
import { BookmarkEntity } from '../entities/bookmark.entity'

export namespace BookmarksRo {
  export type Authorized = {
    bookmarks: BookmarkEntity.Authorized[]
  } & Pagination

  export type Public = {
    bookmarks: BookmarkEntity.Public[]
  } & Pagination
}
