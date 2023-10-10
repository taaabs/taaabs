import { Bookmarks_Ro } from '../types/bookmarks.ro'
import { Bookmarks_Params } from '../types/bookmarks.params'
import { RecordVisit_Params } from '../types/record-visit.params'

export type Bookmarks_Repository = {
  get_bookmarks_on_authorized_user(
    params: Bookmarks_Params.Authorized,
  ): Promise<Bookmarks_Ro>

  get_bookmarks_on_public_user(
    params: Bookmarks_Params.Public,
  ): Promise<Bookmarks_Ro>

  record_visit(params: RecordVisit_Params): Promise<void>
}
