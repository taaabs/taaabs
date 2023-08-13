import { BookmarksParams } from '@repositories/modules/bookmarks/domain/types/bookmarks.params'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { BookmarksDataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks-data-source-impl'
import { BookmarksRepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks-repository-impl'
import { GetBookmarksOnAuthorizedUser } from '@repositories/modules/bookmarks/domain/usecases/get-bookmarks-on-authorized-user'
import { bookmarksActions } from '../bookmarks.slice'
import { monthsActions } from '../../months/months.slice'

export const getBookmarks = ({
  params,
  apiUrl,
}: {
  params: BookmarksParams.Authorized
  apiUrl: string
}) => {
  return async (dispatch: LibraryDispatch, getState: () => LibraryState) => {
    const dataSource = new BookmarksDataSourceImpl(apiUrl)
    const repository = new BookmarksRepositoryImpl(dataSource)
    const getBookmarks = new GetBookmarksOnAuthorizedUser(repository)

    dispatch(bookmarksActions.setIsGettingData(true))

    if (params.after) {
      dispatch(bookmarksActions.setIsGettingMoreBookmarks(true))
    } else {
      dispatch(bookmarksActions.setIsGettingFirstBookmarks(true))
      dispatch(bookmarksActions.setHasMoreBookmarks(null))
    }

    const { bookmarks, pagination } = await getBookmarks.invoke(params)

    dispatch(bookmarksActions.setIsGettingData(false))
    dispatch(bookmarksActions.setHasMoreBookmarks(pagination.hasMore))

    if (params.after) {
      dispatch(bookmarksActions.setMoreBookmarks(bookmarks))
      dispatch(bookmarksActions.setIsGettingMoreBookmarks(false))
    } else {
      dispatch(bookmarksActions.setIncomingBookmarks(bookmarks))
      if (!getState().months.isGettingMonthsData) {
        dispatch(bookmarksActions.setBookmarks(bookmarks))
        dispatch(monthsActions.processTags())
        dispatch(bookmarksActions.setIsGettingFirstBookmarks(false))
      }
    }
  }
}
