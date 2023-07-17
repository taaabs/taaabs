import { BookmarksRo } from '../types/bookmarks.ro'
import { BookmarksParams } from '../types/bookmarks.params'

export type BookmarksRepository = {
  getBookmarksOnAuthorizedUser(
    params: BookmarksParams.Authorized,
  ): Promise<BookmarksRo.Authorized>

  getBookmarksOnPublicUser(
    params: BookmarksParams.Public,
  ): Promise<BookmarksRo.Public>
}
