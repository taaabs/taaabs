import { BookmarksDto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { BookmarksParams } from '../../domain/types/bookmarks.params'

export type BookmarksDataSource = {
  getAuthorized(
    params: BookmarksParams.Authorized,
  ): Promise<BookmarksDto.Response.Authorized>

  getPublic(
    params: BookmarksParams.Public,
  ): Promise<BookmarksDto.Response.Public>
}
