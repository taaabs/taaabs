import { BookmarksOnUserDto } from '@shared/dtos/modules/bookmarks/bookmarks-on-user.dto'
import { BookmarksRo } from '../types/bookmarks.ro'

export type BookmarksRepository = {
  getAuthorizedBookmarks({
    params,
  }: {
    params: BookmarksOnUserDto.QueryParams.Authorized
  }): Promise<BookmarksRo.Authorized>

  getPublicBookmarks({
    username,
    params,
  }: {
    username: string
    params: BookmarksOnUserDto.QueryParams.Public
  }): Promise<BookmarksRo.Public>
}
