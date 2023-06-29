import { BookmarksRo } from '../types/bookmarks.ro'
import { BookmarksParams } from '../types/bookmarks.params'

export type BookmarksRepository = {
  getAuthorized(
    params: BookmarksParams.Authorized,
  ): Promise<BookmarksRo.Authorized>

  getPublic(params: BookmarksParams.Public): Promise<BookmarksRo.Public>
}
