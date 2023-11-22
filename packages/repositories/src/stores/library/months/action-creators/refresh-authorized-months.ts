import { Months_DataSourceImpl } from '@repositories/modules/months/infrastructure/data-sources/months.data-source-impl'
import { LibraryDispatch, LibraryState } from '../../library.store'
import { Months_RepositoryImpl } from '@repositories/modules/months/infrastructure/repositories/months.repository-impl'
import { GetMonthsOnAuthorizedUser_UseCase } from '@repositories/modules/months/domain/usecases/get-months-on-authorized-user.use-case'
import { months_actions } from '../months.slice'
import { bookmarks_actions } from '../../bookmarks/bookmarks.slice'
import { Months_Params } from '@repositories/modules/months/domain/types/months.params'

export const refresh_authorized_months = (params: {
  last_authorized_months_params: Months_Params.Authorized
  api_url: string
  auth_token: string
}) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) => {
    const data_source = new Months_DataSourceImpl(
      params.api_url,
      params.auth_token,
    )
    const repository = new Months_RepositoryImpl(data_source)
    const get_months_use_case = new GetMonthsOnAuthorizedUser_UseCase(
      repository,
    )

    dispatch(months_actions.set_is_fetching_data(true))

    const result = await get_months_use_case.invoke(
      params.last_authorized_months_params,
    )

    const state = get_state()
    dispatch(months_actions.set_data(result))
    dispatch(months_actions.set_is_fetching_data(false))
    dispatch(months_actions.process_tags())
    dispatch(
      bookmarks_actions.set_bookmarks(state.bookmarks.incoming_bookmarks),
    )
    dispatch(bookmarks_actions.set_is_updating_bookmarks(false))
  }
}
