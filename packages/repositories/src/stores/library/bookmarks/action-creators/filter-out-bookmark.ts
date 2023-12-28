import { LibraryDispatch, LibraryState } from '../../library.store'
import { bookmarks_actions } from '../bookmarks.slice'
import { counts_actions } from '../../counts/counts.slice'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'

export const filter_out_bookmark = (params: {
  bookmark_id: number
  last_authorized_counts_params?: Counts_Params.Authorized
  api_url: string
  auth_token: string
}) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) => {
    const state = get_state()

    if (!state.bookmarks.bookmarks)
      throw new Error('[upsert_prefetched_bookmark] Bookmarks should be there.')
    if (!params.last_authorized_counts_params)
      throw new Error(
        '[upsert_prefetched_bookmark] Last authorized months params should be there.',
      )

    dispatch(
      bookmarks_actions.set_incoming_bookmarks(
        state.bookmarks.bookmarks!.filter(
          (bookmark) => bookmark.id != params.bookmark_id,
        ),
      ),
    )

    dispatch(
      counts_actions.refresh_authorized_counts({
        last_authorized_counts_params: params.last_authorized_counts_params,
        api_url: params.api_url,
        auth_token: params.auth_token,
      }),
    )
  }
}
