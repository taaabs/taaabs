import { ArchivedBookmarks } from '@shared/dtos/modules/bookmarks/archived-bookmarks'
import { BookmarkVisibility } from '@shared/dtos/modules/bookmarks/bookmark-visibility'
import { NsfwBookmarks } from '@shared/dtos/modules/bookmarks/nsfw-bookmarks'

export namespace BookmarksParams {
  type Common = {
    tags?: string[]
    categoryId?: string
    starredOnly?: boolean
    archived?: ArchivedBookmarks
    nsfw?: NsfwBookmarks
    after?: string
  }
  export type Authorized = {
    visibility?: BookmarkVisibility
  } & Common

  export type Public = {
    username: string
  } & Common
}
