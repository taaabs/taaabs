import { bookmarks_actions } from '../bookmarks.slice'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { counts_actions } from '../../counts/counts.slice'
import { GetBookmarksOnPublicUser_UseCase } from '@repositories/modules/bookmarks/domain/usecases/get-bookmarks-on-public-user.use-case'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { GetBookmarks_Params } from '@repositories/modules/bookmarks/domain/types/get-bookmarks.params'
import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'

export const get_public_bookmarks = (params: {
  request_params: GetBookmarks_Params.Public
  api_url: string
}) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) => {
    const data_source = new Bookmarks_DataSourceImpl(params.api_url, '')
    const repository = new Bookmarks_RepositoryImpl(data_source)
    const get_bookmarks = new GetBookmarksOnPublicUser_UseCase(repository)

    dispatch(bookmarks_actions.set_is_fetching_data(true))

    if (params.request_params.after) {
      dispatch(bookmarks_actions.set_is_fetching_more_bookmarks(true))
    } else {
      dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(true))
      dispatch(bookmarks_actions.set_has_more_bookmarks(null))
    }

    let bookmarks_with_density: Bookmark_Entity[] = []

    const { bookmarks, pagination } = await get_bookmarks.invoke(
      params.request_params,
    )

    const state = get_state()
    if (state.bookmarks.density == 'compact') {
      bookmarks_with_density = bookmarks.map((bookmark) => ({
        ...bookmark,
        is_compact: true,
      }))
    } else {
      bookmarks_with_density = bookmarks
    }

    dispatch(bookmarks_actions.set_is_fetching_data(false))
    dispatch(bookmarks_actions.set_has_more_bookmarks(pagination.has_more))

    if (params.request_params.after) {
      dispatch(bookmarks_actions.set_more_bookmarks(bookmarks_with_density))
      dispatch(bookmarks_actions.set_is_fetching_more_bookmarks(false))
    } else {
      dispatch(bookmarks_actions.set_incoming_bookmarks(bookmarks_with_density))
      if (!get_state().counts.is_fetching_counts_data) {
        dispatch(bookmarks_actions.set_bookmarks(bookmarks_with_density))
        dispatch(counts_actions.process_tags())
        dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(false))
        dispatch(bookmarks_actions.set_showing_bookmarks_fetched_by_ids(false))
      }
    }
  }
}
