import { GetBookmarks_Ro } from '../types/get-bookmarks.ro'
import { DeleteBookmark_Params } from '../types/delete-bookmark.params'
import { GetBookmarks_Params } from '../types/get-bookmarks.params'
import { RecordVisit_Params } from '../types/record-visit.params'
import { UpsertBookmark_Params } from '../types/upsert-bookmark.params'
import { GetBookmarksByIds_Params } from '../types/get-bookmarks-by-ids.params'
import { GetBookmarksByIds_Ro } from '../types/get-bookmarks-by-ids.ro'
import { Bookmark_Entity } from '../entities/bookmark.entity'
import { GetLinksDataForVisibilityChange_Params } from '../types/get-links-data-for-visibility-change.params'
import { GetLinksDataForVisibilityChange_Ro } from '../types/get-links-data-for-visibility-change.ro'

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

  get_links_data_for_visibility_change(
    params: GetLinksDataForVisibilityChange_Params,
    encryption_key: Uint8Array,
  ): Promise<GetLinksDataForVisibilityChange_Ro>

  upsert_bookmark(
    params: UpsertBookmark_Params,
    encryption_key: Uint8Array,
  ): Promise<Bookmark_Entity>

  delete_bookmark(params: DeleteBookmark_Params): Promise<void>

  record_visit(params: RecordVisit_Params): Promise<void>
}
