import { GetBookmarks_Ro } from '../types/get-bookmarks.ro'
import { DeleteBookmark_Params } from '../types/delete-bookmark.params'
import { GetBookmarks_Params } from '../types/get-bookmarks.params'
import { RecordVisit_Params } from '../types/record-visit.params'
import { UpsertBookmark_Params } from '../types/upsert-bookmark.params'

export type Bookmarks_Repository = {
  get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<GetBookmarks_Ro>

  get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<GetBookmarks_Ro>

  record_visit(params: RecordVisit_Params): Promise<void>

  delete_bookmark(params: DeleteBookmark_Params): Promise<void>

  upsert_bookmark(params: UpsertBookmark_Params): Promise<void>
}
