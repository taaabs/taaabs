import { BookmarksParams } from '@repositories/modules/bookmarks/domain/types/bookmarks.params'
import { BookmarksDataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks-data-source-impl'
import { BookmarksRepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks-repository-impl'
import { bookmarks_actions } from '../bookmarks.slice'
import { GetBookmarksOnPublicUser } from '@repositories/modules/bookmarks/domain/usecases/get-bookmarks-on-public-user'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { months_actions } from '../../months/months.slice'

export const get_bookmarks = (params: {
  query_params: BookmarksParams.Public
  api_url: string
}) => {
  return async (dispatch: LibraryDispatch, getState: () => LibraryState) => {
    const data_source = new BookmarksDataSourceImpl(params.api_url)
    const repository = new BookmarksRepositoryImpl(data_source)
    const get_bookmarks = new GetBookmarksOnPublicUser(repository)

    dispatch(bookmarks_actions.set_is_getting_data(true))

    if (params.query_params.after) {
      dispatch(bookmarks_actions.set_is_getting_more_bookmarks(true))
    } else {
      dispatch(bookmarks_actions.set_is_getting_first_bookmarks(true))
      dispatch(bookmarks_actions.set_has_more_bookmarks(null))
    }

    const { bookmarks, pagination } = await get_bookmarks.invoke(
      params.query_params,
    )

    dispatch(bookmarks_actions.set_is_getting_data(false))
    dispatch(bookmarks_actions.set_has_more_bookmarks(pagination.has_more))

    if (params.query_params.after) {
      dispatch(bookmarks_actions.set_more_bookmarks(bookmarks))
      dispatch(bookmarks_actions.set_is_getting_more_bookmarks(false))
    } else {
      dispatch(bookmarks_actions.set_incoming_bookmarks(bookmarks))
      if (!getState().months.is_getting_months_data) {
        dispatch(bookmarks_actions.set_bookmarks(bookmarks))
        dispatch(months_actions.process_tags())
        dispatch(bookmarks_actions.set_is_getting_first_bookmarks(false))
      }
    }
  }
}
