import { LibraryDispatch, LibraryState } from '../../library.store'
import { counts_actions } from '../counts.slice'
import { bookmarks_actions } from '../../bookmarks/bookmarks.slice'
import { Counts_RepositoryImpl } from '@repositories/modules/counts/infrastructure/repositories/counts.repository-impl'
import { GetCountsOnAuthorizedUser_UseCase } from '@repositories/modules/counts/domain/usecases/get-counts-on-authorized-user.use-case'
import { Counts_DataSourceImpl } from '@repositories/modules/counts/infrastructure/data-sources/counts.data-source-impl'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'
import { KyInstance } from 'ky'

export const get_authorized_counts = (params: {
  request_params: Counts_Params.Authorized
  ky: KyInstance
}) => {
  return async (dispatch: LibraryDispatch, get_state: () => LibraryState) => {
    const data_source = new Counts_DataSourceImpl(params.ky)
    const repository = new Counts_RepositoryImpl(data_source)
    const get_months_use_case = new GetCountsOnAuthorizedUser_UseCase(
      repository,
    )

    dispatch(counts_actions.set_is_fetching_data(true))

    const result = await get_months_use_case.invoke(params.request_params)

    if (result.awaits_processing) return

    dispatch(counts_actions.set_data(result))
    dispatch(counts_actions.set_is_fetching_data(false))

    const state = get_state()
    if (
      (!state.bookmarks.is_fetching_data &&
        state.bookmarks.is_fetching_first_bookmarks) ||
      state.bookmarks.should_refetch_counts
    ) {
      dispatch(counts_actions.process_tags())
      dispatch(
        bookmarks_actions.set_bookmarks(state.bookmarks.incoming_bookmarks),
      )
      dispatch(bookmarks_actions.set_is_fetching_first_bookmarks(false))
      dispatch(
        bookmarks_actions.set_first_bookmarks_fetched_at_timestamp(Date.now()),
      )
      dispatch(bookmarks_actions.set_showing_bookmarks_fetched_by_ids(false))
      if (state.bookmarks.should_refetch_counts) {
        dispatch(bookmarks_actions.set_should_refetch_counts(false))
      }
    }
  }
}
