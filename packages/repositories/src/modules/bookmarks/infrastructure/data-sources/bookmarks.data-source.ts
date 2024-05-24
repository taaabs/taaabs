import { Bookmarks_Dto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { RecordVisit_Params } from '../../domain/types/record-visit.params'
import { DeleteBookmark_Params } from '../../domain/types/delete-bookmark.params'
import { UpsertBookmark_Params } from '../../domain/types/upsert-bookmark.params'
import { BookmarksByIds_Dto } from '@shared/types/modules/bookmarks/bookmarks-by-ids.dto'
import { GetBookmarksByIds_Params } from '../../domain/types/get-bookmarks-by-ids.params'
import { LinksDataForVisibilityChange_Dto } from '@shared/types/modules/bookmarks/links-data-for-visibility-change.dto'
import { GetLinksDataForVisibilityChange_Params } from '../../domain/types/get-links-data-for-visibility-change.params'

export type Bookmarks_DataSource = {
  get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<Bookmarks_Dto.Response.Authorized>

  get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<Bookmarks_Dto.Response.Public>

  get_bookmarks_by_ids_authorized(
    params: GetBookmarksByIds_Params.Authorized,
  ): Promise<BookmarksByIds_Dto.Response.Authorized>

  get_bookmarks_by_ids_public(
    params: GetBookmarksByIds_Params.Public,
  ): Promise<BookmarksByIds_Dto.Response.Public>

  get_links_data_for_visibility_change(
    params: GetLinksDataForVisibilityChange_Params,
  ): Promise<LinksDataForVisibilityChange_Dto.Response>

  upsert_bookmark(
    params: UpsertBookmark_Params,
    encryption_key: Uint8Array,
  ): Promise<Bookmarks_Dto.Response.AuthorizedBookmark>

  delete_bookmark(params: DeleteBookmark_Params): Promise<void>

  record_visit(params: RecordVisit_Params): Promise<void>
}
