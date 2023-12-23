import { GetBookmarks_Params } from '../types/get-bookmarks.params'
import { GetBookmarks_Ro } from '../types/get-bookmarks.ro'
import { GetLastUpdated_Ro } from '../types/get-last-updated.ro'

export type LibrarySearch_Repository = {
  get_last_updated_at_on_authorized_user(): Promise<GetLastUpdated_Ro>

  get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params,
  ): Promise<GetBookmarks_Ro>
}
