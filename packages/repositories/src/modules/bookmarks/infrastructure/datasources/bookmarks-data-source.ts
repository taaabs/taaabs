import { BookmarksOnUserDto } from '@shared/dtos/modules/bookmarks/bookmarks-on-user.dto'

export type BookmarksDataSource = {
  getBookmarksOnCurrentUser({
    params,
  }: {
    params: BookmarksOnUserDto.QueryParams.OnCurrentUser
  }): Promise<BookmarksOnUserDto.Response.All>

  getBookmarksOnOtherUser({
    username,
    params,
  }: {
    username: string
    params: BookmarksOnUserDto.QueryParams.OnOtherUser
  }): Promise<BookmarksOnUserDto.Response.Public>
}
