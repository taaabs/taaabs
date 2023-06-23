import { BookmarksDto } from '@shared/dtos/v1/bookmarks/bookmarks-on-user.dto'
import { BookmarksRo } from '../types/bookmarks.ro'

export type BookmarksRepository = {
  getBookmarksOnCurrentUser({
    params,
  }: {
    params: BookmarksDto.QueryParams.OnCurrentUser
  }): Promise<BookmarksRo.OnCurrentUser>

  getBookmarksOnOtherUser({
    username,
    params,
  }: {
    username: string
    params: BookmarksDto.QueryParams.OnOtherUser
  }): Promise<BookmarksRo.OnOtherUser>
}
