import { BookmarksRo } from '../types/bookmarks.ro'
import { BookmarksParams } from '../types/bookmarks.params'

export type BookmarksRepository = {
  getBookmarksOnAuthorizedUser(
    params: BookmarksParams.AuthorizedUser,
  ): Promise<BookmarksRo.AuthorizedUser>

  getBookmarksOnOtherUser(
    params: BookmarksParams.OtherUser,
  ): Promise<BookmarksRo.OtherUser>
}
