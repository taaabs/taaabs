import { LibrarySearchBookmarks_Dto } from '@shared/types/modules/library-search/library-search-bookmarks.dto'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { LibrarySearchLastUpdated_Dto } from '@shared/types/modules/library-search/library-search-last-updated.dto'

export type LibrarySearch_DataSource = {
  get_last_updated_on_authorized_user(): Promise<LibrarySearchLastUpdated_Dto.Response>

  get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params,
  ): Promise<LibrarySearchBookmarks_Dto.Response.Authorized>
}
