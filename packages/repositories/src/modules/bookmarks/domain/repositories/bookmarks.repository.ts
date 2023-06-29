import { BookmarksDto } from '@shared/dtos/modules/bookmarks/bookmarks.dto'
import { BookmarksRo } from '../types/bookmarks.ro'

export type BookmarksRepository = {
  getAuthorizedBookmarks({
    params,
  }: {
    params: BookmarksDto.QueryParams.Authorized
  }): Promise<BookmarksRo.Authorized>

  getPublicBookmarks({
    username,
    params,
  }: {
    username: string
    params: BookmarksDto.QueryParams.Public
  }): Promise<BookmarksRo.Public>
}
