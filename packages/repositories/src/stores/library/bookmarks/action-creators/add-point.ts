import { LibraryDispatch, LibraryState } from '../../library.store'
import { bookmarks_actions } from '../bookmarks.slice'

export const add_point = (params: { bookmark_id: number }) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) => {
    const state = get_state()

    if (!state.bookmarks.bookmarks)
      throw new Error('[add_point] Bookmarks should be there.')

    dispatch(
      bookmarks_actions.set_bookmarks(
        state.bookmarks.bookmarks.map((bookmark) => {
          if (bookmark.id == params.bookmark_id) {
            return {
              ...bookmark,
              points_total: bookmark.points_total
                ? bookmark.points_total + 1
                : 1,
            }
          } else {
            return bookmark
          }
        }),
      ),
    )
  }
}
