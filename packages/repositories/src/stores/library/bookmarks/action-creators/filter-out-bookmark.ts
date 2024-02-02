import { LibraryDispatch, LibraryState } from '../../library.store'
import { bookmarks_actions } from '../bookmarks.slice'

export const filter_out_bookmark = (params: { bookmark_id: number }) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) => {
    const state = get_state()

    if (!state.bookmarks.bookmarks)
      throw new Error('[upsert_prefetched_bookmark] Bookmarks should be there.')

    dispatch(
      bookmarks_actions.set_incoming_bookmarks(
        state.bookmarks.bookmarks!.filter(
          (bookmark) => bookmark.id != params.bookmark_id,
        ),
      ),
    )
  }
}
