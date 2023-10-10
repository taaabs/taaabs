import { Bookmarks_Dto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { Bookmarks_Params } from '../../domain/types/bookmarks.params'
import { RecordVisit_Params } from '../../domain/types/record-visit.params'

export type Bookmarks_DataSource = {
  get_bookmarks_on_authorized_user(
    params: Bookmarks_Params.Authorized,
  ): Promise<Bookmarks_Dto.Response.Authorized>

  get_bookmarks_on_public_user(
    params: Bookmarks_Params.Public,
  ): Promise<Bookmarks_Dto.Response.Public>

  record_visit(params: RecordVisit_Params): Promise<void>
}
