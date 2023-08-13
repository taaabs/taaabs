import { MonthsParams } from '@repositories/modules/months/domain/types/months.params'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { MonthsDataSourceImpl } from '@repositories/modules/months/infrastructure/data-sources/months-data-source-impl'
import { MonthsRepositoryImpl } from '@repositories/modules/months/infrastructure/repositories/months-repository-impl'
import { GetMonthsOnPublicUser } from '@repositories/modules/months/domain/usecases/get-months-on-public-user'
import { monthsActions } from '../months.slice'
import { bookmarksActions } from '../../bookmarks/bookmarks.slice'

export const getMonths = ({
  params,
  apiUrl,
}: {
  params: MonthsParams.Public
  apiUrl: string
}) => {
  return async (dispatch: LibraryDispatch, getState: () => LibraryState) => {
    const dataSource = new MonthsDataSourceImpl(apiUrl)
    const repository = new MonthsRepositoryImpl(dataSource)
    const getMonths = new GetMonthsOnPublicUser(repository)

    dispatch(monthsActions.setIsGettingData(true))

    const result = await getMonths.invoke(params)

    dispatch(monthsActions.setData(result))
    dispatch(monthsActions.setIsGettingData(false))

    const state = getState()
    if (
      !state.bookmarks.isGettingData &&
      state.bookmarks.isGettingFirstBookmarks
    ) {
      dispatch(monthsActions.processTags())
      dispatch(bookmarksActions.setBookmarks(state.bookmarks.incomingBookmarks))
      dispatch(bookmarksActions.setIsGettingFirstBookmarks(false))
    }
  }
}
