import { LibraryDispatch, LibraryState } from '../../library.store'
import { counts_actions } from '../counts.slice'
import { bookmarks_actions } from '../../bookmarks/bookmarks.slice'
import { Counts_DataSourceImpl } from '@repositories/modules/counts/infrastructure/data-sources/counts.data-source-impl'
import { Counts_RepositoryImpl } from '@repositories/modules/counts/infrastructure/repositories/counts.repository-impl'
import { GetCountsOnPublicUser_UseCase } from '@repositories/modules/counts/domain/usecases/get-counts-on-public-user.use-case'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'

export const get_public_counts = (params: {
  request_params: Counts_Params.Public
  api_url: string
}) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) => {
    const data_source = new Counts_DataSourceImpl(params.api_url, '')
    const repository = new Counts_RepositoryImpl(data_source)
    const get_months = new GetCountsOnPublicUser_UseCase(repository)

    dispatch(counts_actions.set_is_fetching_data(true))

    const result = await get_months.invoke(params.request_params)

    dispatch(counts_actions.set_data(result))
    dispatch(counts_actions.set_is_fetching_data(false))

    const state = get_state()
    if (
      !state.bookmarks.is_fetching_data &&
      state.bookmarks.is_fetching_first_bookmarks
    ) {
      dispatch(counts_actions.process_tags())
      dispatch(
        bookmarks_actions.set_bookmarks(state.bookmarks.incoming_bookmarks),
      )
      dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(false))
    }
  }
}