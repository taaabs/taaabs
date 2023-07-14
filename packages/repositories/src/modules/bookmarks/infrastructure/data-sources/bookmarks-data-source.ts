import { BookmarksDto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { BookmarksParams } from '../../domain/types/bookmarks.params'

export type BookmarksDataSource = {
  getBookmarksOnAuthorizedUser(
    params: BookmarksParams.AuthorizedUser,
  ): Promise<BookmarksDto.Response.AuthorizedUser>

  getBookmarksOnOtherUser(
    params: BookmarksParams.OtherUser,
  ): Promise<BookmarksDto.Response.OtherUser>
}
