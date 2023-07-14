import { Pagination } from '@repositories/core/pagination'
import { BookmarkEntity } from '../entities/bookmark.entity'

export namespace BookmarksRo {
  export type AuthorizedUser = {
    bookmarks: BookmarkEntity.AuthorizedUser[]
  } & Pagination

  export type OtherUser = {
    bookmarks: BookmarkEntity.OtherUser[]
  } & Pagination
}
