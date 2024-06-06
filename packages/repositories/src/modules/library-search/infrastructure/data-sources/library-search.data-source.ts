import { LibrarySearchBookmarks_Dto } from '@shared/types/modules/library-search/library-search-bookmarks.dto'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'

export type LibrarySearch_DataSource = {
  get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<LibrarySearchBookmarks_Dto.Response.Authorized>

  get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<LibrarySearchBookmarks_Dto.Response.Public>
}
