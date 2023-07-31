import { BookmarksParams } from '@repositories/modules/bookmarks/domain/types/bookmarks.params'
import { BookmarksDataSourceImpl } from '@repositories/modules/bookmarks/infrastructure/data-sources/bookmarks-data-source-impl'
import { BookmarksRepositoryImpl } from '@repositories/modules/bookmarks/infrastructure/repositories/bookmarks-repository-impl'
import { bookmarksActions } from '../bookmarks.slice'
import { GetBookmarksOnPublicUser } from '@repositories/modules/bookmarks/domain/usecases/get-bookmarks-on-public-user'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { monthsActions } from '../../months/months.slice'

export const getBookmarks = ({
  params,
  apiUrl,
}: {
  params: BookmarksParams.Public
  apiUrl: string
}) => {
  return async (dispatch: LibraryDispatch, getState: () => LibraryState) => {
    const state = getState()

    const dataSource = new BookmarksDataSourceImpl(apiUrl)
    const repository = new BookmarksRepositoryImpl(dataSource)
    const getBookmarks = new GetBookmarksOnPublicUser(repository)

    dispatch(bookmarksActions.setIsGettingData(true))

    if (params.after) {
      dispatch(bookmarksActions.setIsGettingMoreBookmarks(true))
    } else {
      dispatch(bookmarksActions.setIsGettingFirstBookmarks(true))
      dispatch(bookmarksActions.setHasMoreBookmarks(null))
    }
    const { bookmarks, pagination } = await getBookmarks.invoke(params)

    dispatch(bookmarksActions.setIsGettingData(false))

    if (params.after) {
      if (state.bookmarks.bookmarks == null) {
        throw 'Bookmarks should not be null.'
      }
      dispatch(
        bookmarksActions.setBookmarks([
          ...state.bookmarks.bookmarks,
          ...bookmarks,
        ]),
      )
      dispatch(bookmarksActions.setIsGettingMoreBookmarks(false))
    } else {
      dispatch(bookmarksActions.setIncomingBookmarks(bookmarks))
    }
    dispatch(bookmarksActions.setHasMoreBookmarks(pagination.hasMore))

    if (!getState().months.isGettingMonthsData) {
      dispatch(bookmarksActions.setBookmarks(bookmarks))
      dispatch(monthsActions.processTags())
      dispatch(bookmarksActions.setIsGettingFirstBookmarks(false))
    }
  }
}
