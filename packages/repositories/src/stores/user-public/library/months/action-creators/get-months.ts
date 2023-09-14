import { MonthsParams } from '@repositories/modules/months/domain/types/months.params'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { MonthsDataSourceImpl } from '@repositories/modules/months/infrastructure/data-sources/months-data-source-impl'
import { MonthsRepositoryImpl } from '@repositories/modules/months/infrastructure/repositories/months-repository-impl'
import { GetMonthsOnPublicUser } from '@repositories/modules/months/domain/usecases/get-months-on-public-user'
import { months_actions } from '../months.slice'
import { bookmarks_actions } from '../../bookmarks/bookmarks.slice'

export const get_months = (params: {
  query_params: MonthsParams.Public
  api_url: string
}) => {
  return async (dispatch: LibraryDispatch, getState: () => LibraryState) => {
    const data_source = new MonthsDataSourceImpl(params.api_url)
    const repository = new MonthsRepositoryImpl(data_source)
    const get_months = new GetMonthsOnPublicUser(repository)

    dispatch(months_actions.set_is_getting_data(true))

    const result = await get_months.invoke(params.query_params)

    dispatch(months_actions.set_data(result))
    dispatch(months_actions.set_is_getting_data(false))

    const state = getState()
    if (
      !state.bookmarks.is_getting_data &&
      state.bookmarks.is_getting_first_bookmarks
    ) {
      dispatch(months_actions.process_tags())
      dispatch(
        bookmarks_actions.set_bookmarks(state.bookmarks.incoming_bookmarks),
      )
      dispatch(bookmarks_actions.set_is_getting_first_bookmarks(false))
    }
  }
}
