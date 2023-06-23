import { Pagination } from '@/core/pagination'
import { BookmarkEntity } from '../entities/bookmark.entity'

export namespace BookmarksRo {
  export type OnCurrentUser = {
    bookmarks: BookmarkEntity.OnCurrentUser[]
  } & Pagination

  export type OnOtherUser = {
    bookmarks: BookmarkEntity.OnOtherUser[]
  } & Pagination
}
