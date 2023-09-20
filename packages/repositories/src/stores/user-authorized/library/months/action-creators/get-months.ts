import { Months_Params } from '@repositories/modules/months/domain/types/months.params'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Months_RepositoryImpl } from '@repositories/modules/months/infrastructure/repositories/months-repository-impl'
import { GetMonthsOnAuthorizedUser_UseCase } from '@repositories/modules/months/domain/usecases/get-months-on-authorized-user.use-case'
import { months_actions } from '@repositories/stores/user-authorized/library/months/months.slice'
import { bookmarksActions } from '../../bookmarks/bookmarks.slice'
import { Months_DataSourceImpl } from '@repositories/modules/months/infrastructure/data-sources/months.data-source-impl'

export const getMonths = (params: {
  query_params: Months_Params.Authorized
  api_url: string
}) => {
  return async (dispatch: LibraryDispatch, getState: () => LibraryState) => {
    const data_source = new Months_DataSourceImpl(params.api_url)
    const repository = new Months_RepositoryImpl(data_source)
    const getMonths = new GetMonthsOnAuthorizedUser_UseCase(repository)

    dispatch(months_actions.set_is_getting_data(true))

    const result = await getMonths.invoke(params.query_params)

    dispatch(months_actions.set_data(result))
    dispatch(months_actions.set_is_getting_data(false))

    const state = getState()
    if (
      !state.bookmarks.isGettingData &&
      state.bookmarks.is_getting_first_bookmarks
    ) {
      dispatch(months_actions.process_tags())
      dispatch(bookmarksActions.setBookmarks(state.bookmarks.incomingBookmarks))
      dispatch(bookmarksActions.setIsGettingFirstBookmarks(false))
    }
  }
}
