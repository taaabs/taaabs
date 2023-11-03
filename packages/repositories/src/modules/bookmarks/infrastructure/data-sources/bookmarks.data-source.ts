import { Bookmarks_Dto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { RecordVisit_Params } from '../../domain/types/record-visit.params'
import { DeleteBookmark_Params } from '../../domain/types/delete-bookmark.params'

export type Bookmarks_DataSource = {
  get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<Bookmarks_Dto.Response.Authorized>

  get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<Bookmarks_Dto.Response.Public>

  record_visit(params: RecordVisit_Params): Promise<void>

  delete_bookmark(params: DeleteBookmark_Params): Promise<void>
}
