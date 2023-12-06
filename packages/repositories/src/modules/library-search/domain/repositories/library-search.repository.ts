import { GetBookmarks_Params } from '../types/get-bookmarks.params'
import { GetBookmarks_Ro } from '../types/get-bookmarks.ro'
import { GetLastUpdated_Params } from '../types/get-last-updated.params'
import { GetLastUpdated_Ro } from '../types/get-last-updated.ro'

export type LibrarySearch_Repository = {
  get_last_updated_at_on_authorized_user(
    params: GetLastUpdated_Params.Authorized,
  ): Promise<GetLastUpdated_Ro>

  get_last_updated_at_on_public_user(
    params: GetLastUpdated_Params.Public,
  ): Promise<GetLastUpdated_Ro>

  get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<GetBookmarks_Ro>

  get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<GetBookmarks_Ro>
}
