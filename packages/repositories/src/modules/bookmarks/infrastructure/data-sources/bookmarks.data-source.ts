import { Bookmarks_Dto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { RecordVisit_Params } from '../../domain/types/record-visit.params'
import { DeleteBookmark_Params } from '../../domain/types/delete-bookmark.params'
import { UpsertBookmark_Params } from '../../domain/types/upsert-bookmark.params'
import { BookmarksByIds_Dto } from '@shared/types/modules/bookmarks/bookmarks-by-ids.dto'
import { GetBookmarksByIds_Params } from '../../domain/types/get-bookmarks-by-ids.params'
import { GetLinksData_Params } from '../../domain/types/get-links-data.params'
import { LinksData_Dto } from '@shared/types/modules/bookmarks/links-data.dto'
import { GetCover_Params } from '../../domain/types/get-cover.params'
import { FindByUrlHash_Params } from '../../domain/types/find-by-url-hash.params'
import { FindByUrlHash_Dto } from '@shared/types/modules/bookmarks/find-by-url-hash.dto'

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

  get_links_data_authorized(
    params: GetLinksData_Params.Authorized,
  ): Promise<LinksData_Dto.Response.Authorized>

  get_links_data_public(
    params: GetLinksData_Params.Public,
  ): Promise<LinksData_Dto.Response.Public>

  upsert_bookmark(
    params: UpsertBookmark_Params,
    encryption_key: Uint8Array,
  ): Promise<Bookmarks_Dto.Response.AuthorizedBookmark>

  delete_bookmark(params: DeleteBookmark_Params): Promise<void>

  get_cover(params: GetCover_Params): Promise<string>

  record_visit(params: RecordVisit_Params): Promise<void>

  find_by_url_hash(
    params: FindByUrlHash_Params,
    encryption_key: Uint8Array,
  ): Promise<FindByUrlHash_Dto.Response>
}
