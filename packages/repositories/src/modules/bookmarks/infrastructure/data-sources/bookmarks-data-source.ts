import { BookmarksDto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { BookmarksParams } from '../../domain/types/bookmarks.params'

export type BookmarksDataSource = {
  get_bookmarks_on_authorized_user(
    params: BookmarksParams.Authorized,
  ): Promise<BookmarksDto.Response.Authorized>

  get_bookmarks_on_public_user(
    params: BookmarksParams.Public,
  ): Promise<BookmarksDto.Response.Public>
}
