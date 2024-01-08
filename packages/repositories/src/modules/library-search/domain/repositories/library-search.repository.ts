import { GetBookmarks_Params } from '../types/get-bookmarks.params'
import { GetBookmarks_Ro } from '../types/get-bookmarks.ro'
import { GetLastUpdatedAt_Params } from '../types/get-last-updated-at.params'
import { GetLastUpdated_Ro } from '../types/get-last-updated.ro'

export type LibrarySearch_Repository = {
  get_last_updated_at_on_authorized_user(): Promise<GetLastUpdated_Ro>

  get_last_updated_at_on_public_user(
    params: GetLastUpdatedAt_Params.Public,
  ): Promise<GetLastUpdated_Ro>

  get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<GetBookmarks_Ro>

  get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<GetBookmarks_Ro>
}
