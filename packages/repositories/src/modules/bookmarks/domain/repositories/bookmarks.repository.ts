import { BookmarksRo } from '../types/bookmarks.ro'
import { BookmarksParams } from '../types/bookmarks.params'

export type BookmarksRepository = {
  get_bookmarks_on_authorized_user(
    params: BookmarksParams.Authorized,
  ): Promise<BookmarksRo.Authorized>

  get_bookmarks_on_public_user(
    params: BookmarksParams.Public,
  ): Promise<BookmarksRo.Public>
}
