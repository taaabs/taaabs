import { bookmarks_actions } from '../bookmarks.slice'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { counts_actions } from '../../counts/counts.slice'
import { Bookmarks_DataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks.data-source-impl'
import { Bookmarks_RepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks.repository-impl'
import { GetBookmarksOnAuthorizedUser_UseCase } from '@repositories/modules/bookmarks/domain/usecases/get-bookmarks-on-authorized-user.use-case'
import { GetBookmarks_Params } from '@repositories/modules/bookmarks/domain/types/get-bookmarks.params'
import { Bookmark_Entity } from '@repositories/modules/bookmarks/domain/entities/bookmark.entity'

export const get_authorized_bookmarks = (params: {
  request_params: GetBookmarks_Params.Authorized
  api_url: string
  auth_token: string
}) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) => {
    const data_source = new Bookmarks_DataSourceImpl(
      params.api_url,
      params.auth_token,
    )
    const repository = new Bookmarks_RepositoryImpl(data_source)
    const get_bookmarks = new GetBookmarksOnAuthorizedUser_UseCase(repository)

    dispatch(bookmarks_actions.set_is_fetching_data(true))

    if (params.request_params.after) {
      dispatch(bookmarks_actions.set_is_fetching_more_bookmarks(true))
    } else {
      dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(true))
      dispatch(bookmarks_actions.set_has_more_bookmarks(null))
    }

    const { bookmarks, pagination } = await get_bookmarks.invoke(
      params.request_params,
    )

    let bookmarks_with_density: Bookmark_Entity[] = []

    if (get_state().bookmarks.density == 'compact') {
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
        dispatch(counts_actions.process_tags())
        dispatch(bookmarks_actions.set_bookmarks(bookmarks_with_density))
        dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(false))
        dispatch(bookmarks_actions.set_showing_bookmarks_fetched_by_ids(false))
      }
    }
  }
}
