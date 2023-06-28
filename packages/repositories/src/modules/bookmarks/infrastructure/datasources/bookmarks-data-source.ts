import { BookmarksOnUserDto } from '@shared/dtos/modules/bookmarks/bookmarks-on-user.dto'

export type BookmarksDataSource = {
  getBookmarksOnCurrentUser({
    params,
  }: {
    params: BookmarksOnUserDto.QueryParams.Authorized
  }): Promise<BookmarksOnUserDto.Response.Authorized>

  getBookmarksOnOtherUser({
    username,
    params,
  }: {
    username: string
    params: BookmarksOnUserDto.QueryParams.Public
  }): Promise<BookmarksOnUserDto.Response.Public>
}
