import { Pagination } from '@repositories/core/pagination'
import { Bookmark_Entity } from '../entities/bookmark.entity'

export namespace Bookmarks_Ro {
  export type Authorized = {
    bookmarks: Bookmark_Entity.Authorized[]
  } & Pagination

  export type Public = {
    bookmarks: Bookmark_Entity.Public[]
  } & Pagination
}
