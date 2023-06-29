import { BookmarksDto } from '@shared/dtos/modules/bookmarks/bookmarks.dto'

export type BookmarksDataSource = {
  getBookmarksOnCurrentUser({
    params,
  }: {
    params: BookmarksDto.QueryParams.Authorized
  }): Promise<BookmarksDto.Response.Authorized>

  getBookmarksOnOtherUser({
    username,
    params,
  }: {
    username: string
    params: BookmarksDto.QueryParams.Public
  }): Promise<BookmarksDto.Response.Public>
}
