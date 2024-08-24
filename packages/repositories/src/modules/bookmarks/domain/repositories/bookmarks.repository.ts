import { GetBookmarks_Ro } from '../types/get-bookmarks.ro'
import { DeleteBookmark_Params } from '../types/delete-bookmark.params'
import { GetBookmarks_Params } from '../types/get-bookmarks.params'
import { RecordVisit_Params } from '../types/record-visit.params'
import { UpsertBookmark_Params } from '../types/upsert-bookmark.params'
import { GetBookmarksByIds_Params } from '../types/get-bookmarks-by-ids.params'
import { GetBookmarksByIds_Ro } from '../types/get-bookmarks-by-ids.ro'
import { Bookmark_Entity } from '../entities/bookmark.entity'
import { GetLinksData_Params } from '../types/get-links-data.params'
import { GetLinksData_Ro } from '../types/get-links-data.ro'
import { GetCover_Params } from '../types/get-cover.params'
import { FindByUrlHash_Params } from '../types/find-by-url-hash.params'
import { FindByUrlHash_Ro } from '../types/find-by-url-hash.ro'
import { DeleteBookmarkByUrlHash_Params } from '../types/delete-bookmark-by-url-hash.params'

export type Bookmarks_Repository = {
  get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
    encryption_key: Uint8Array,
  ): Promise<GetBookmarks_Ro>

  get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<GetBookmarks_Ro>

  get_bookmarks_by_ids_authorized(
    params: GetBookmarksByIds_Params.Authorized,
    encryption_key: Uint8Array,
  ): Promise<GetBookmarksByIds_Ro>

  get_bookmarks_by_ids_public(
    params: GetBookmarksByIds_Params.Public,
  ): Promise<GetBookmarksByIds_Ro>

  get_links_data_authorized(
    params: GetLinksData_Params.Authorized,
    encryption_key: Uint8Array,
  ): Promise<GetLinksData_Ro>

  get_links_data_public(
    params: GetLinksData_Params.Public,
  ): Promise<GetLinksData_Ro>

  upsert_bookmark(
    params: UpsertBookmark_Params,
    encryption_key: Uint8Array,
  ): Promise<Bookmark_Entity>

  delete_bookmark(params: DeleteBookmark_Params): Promise<void>

  get_cover(
    params: GetCover_Params,
    encryption_key: Uint8Array,
  ): Promise<string>

  record_visit(params: RecordVisit_Params): Promise<void>

  find_by_url_hash(
    params: FindByUrlHash_Params,
    encryption_key: Uint8Array,
  ): Promise<FindByUrlHash_Ro>

  delete_bookmark_by_url_hash(
    params: DeleteBookmarkByUrlHash_Params,
    encryption_key: Uint8Array,
  ): Promise<void>
}
