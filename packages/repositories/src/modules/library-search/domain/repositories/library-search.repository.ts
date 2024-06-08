import { GetBookmarks_Params } from '../types/get-bookmarks.params'
import { GetBookmarks_Ro } from '../types/get-bookmarks.ro'

export type LibrarySearch_Repository = {
  get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
    encryption_key: Uint8Array,
  ): Promise<GetBookmarks_Ro>

  get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<GetBookmarks_Ro>

  get_bookmarks_for_full_text_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
    encryption_key: Uint8Array,
  ): Promise<GetBookmarks_Ro>

  get_bookmarks_for_full_text_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<GetBookmarks_Ro>
}
