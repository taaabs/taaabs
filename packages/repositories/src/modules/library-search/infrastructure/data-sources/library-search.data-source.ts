import { LibrarySearchBookmarks_Dto } from '@shared/types/modules/library-search/library-search-bookmarks.dto'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { LibrarySearchBookmarksForFullText_Dto } from '@shared/types/modules/library-search/library-search-bookmarks-for-full-text.dto'

export type LibrarySearch_DataSource = {
  get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<LibrarySearchBookmarks_Dto.Response.Authorized>

  get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<LibrarySearchBookmarks_Dto.Response.Public>

  get_bookmarks_for_full_text_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<LibrarySearchBookmarksForFullText_Dto.Response.Authorized>

  get_bookmarks_for_full_text_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<LibrarySearchBookmarksForFullText_Dto.Response.Public>
}
