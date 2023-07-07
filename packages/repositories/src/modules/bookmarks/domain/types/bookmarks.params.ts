import { ArchivedBookmarks } from '@shared/dtos/modules/bookmarks/archived-bookmarks'
import { BookmarkVisibility } from '@shared/dtos/modules/bookmarks/bookmark-visibility'
import { NsfwBookmarks } from '@shared/dtos/modules/bookmarks/nsfw-bookmarks'
import { SortBy } from '@shared/dtos/modules/bookmarks/sort-by'

export namespace BookmarksParams {
  type Common = {
    sortBy?: SortBy
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
