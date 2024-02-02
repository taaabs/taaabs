import { LibraryDispatch, LibraryState } from '../../library.store'
import { bookmarks_actions } from '../bookmarks.slice'
import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'

export const replace_bookmark = (params: { bookmark: Bookmark_Entity }) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) => {
    const state = get_state()

    if (!state.bookmarks.bookmarks)
      throw new Error('[upsert_prefetched_bookmark] Bookmarks should be there.')

    const modified_bookmark_index = state.bookmarks.bookmarks.findIndex(
      (bookmark) => bookmark.id == params.bookmark.id,
    )

    if (modified_bookmark_index == -1)
      throw new Error('[upsert_prefetched_bookmark] Bookmark should be there.')

    // TODO see if bookmark is missing one of selected tags, if so, remove

    dispatch(
      bookmarks_actions.set_incoming_bookmarks(
        state.bookmarks.bookmarks.map((bookmark) => {
          if (
            bookmark.id ==
            state.bookmarks.bookmarks![modified_bookmark_index].id
          ) {
            return { ...params.bookmark, is_compact: false }
          } else {
            return bookmark
          }
        }),
      ),
    )
  }
}
