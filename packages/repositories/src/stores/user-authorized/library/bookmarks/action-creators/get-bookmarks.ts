import { BookmarksParams } from '@repositories/modules/bookmarks/domain/types/bookmarks.params'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { BookmarksDataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks-data-source-impl'
import { BookmarksRepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks-repository-impl'
import { GetBookmarksOnAuthorizedUser } from '@repositories/modules/bookmarks/domain/usecases/get-bookmarks-on-authorized-user'
import { bookmarksActions } from '../bookmarks.slice'
import { months_actions } from '../../months/months.slice'

export const get_bookmarks = (params: {
  query_params: BookmarksParams.Authorized
  api_url: string
}) => {
  return async (dispatch: LibraryDispatch, getState: () => LibraryState) => {
    const data_source = new BookmarksDataSourceImpl(params.api_url)
    const repository = new BookmarksRepositoryImpl(data_source)
    const get_bookmarks = new GetBookmarksOnAuthorizedUser(repository)

    dispatch(bookmarksActions.setIsGettingData(true))

    if (params.query_params.after) {
      dispatch(bookmarksActions.setIsGettingMoreBookmarks(true))
    } else {
      dispatch(bookmarksActions.setIsGettingFirstBookmarks(true))
      dispatch(bookmarksActions.setHasMoreBookmarks(null))
    }

    const { bookmarks, pagination } = await get_bookmarks.invoke(
      params.query_params,
    )

    dispatch(bookmarksActions.setIsGettingData(false))
    dispatch(bookmarksActions.setHasMoreBookmarks(pagination.has_more))

    if (params.query_params.after) {
      dispatch(bookmarksActions.setMoreBookmarks(bookmarks))
      dispatch(bookmarksActions.setIsGettingMoreBookmarks(false))
    } else {
      dispatch(bookmarksActions.setIncomingBookmarks(bookmarks))
      if (!getState().months.is_getting_months_data) {
        dispatch(bookmarksActions.setBookmarks(bookmarks))
        dispatch(months_actions.process_tags())
        dispatch(bookmarksActions.setIsGettingFirstBookmarks(false))
      }
    }
  }
}
