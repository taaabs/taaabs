import { BookmarksDto } from '@shared/dtos/v1/bookmarks/bookmarks-on-user.dto'

export type BookmarksDataSource = {
  getBookmarksOnCurrentUser({
    params,
  }: {
    params: BookmarksDto.QueryParams.OnCurrentUser
  }): Promise<BookmarksDto.Response.OnCurrentUser>

  getBookmarksOnOtherUser({
    username,
    params,
  }: {
    username: string
    params: BookmarksDto.QueryParams.OnOtherUser
  }): Promise<BookmarksDto.Response.OnOtherUser>
}
