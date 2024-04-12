import { LibraryDispatch } from '../../library.store'
import { counts_actions } from '../counts.slice'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'
import { Counts_DataSourceImpl } from '@repositories/modules/counts/infrastructure/data-sources/counts.data-source-impl'
import { Counts_RepositoryImpl } from '@repositories/modules/counts/infrastructure/repositories/counts.repository-impl'
import { GetCountsOnAuthorizedUser_UseCase } from '@repositories/modules/counts/domain/usecases/get-counts-on-authorized-user.use-case'
import { KyInstance } from 'ky'
import { Pinned_DataSourceImpl } from '@repositories/modules/pinned/infrastructure/data-sources/pinned.data-source-impl'
import { Pinned_RepositoryImpl } from '@repositories/modules/pinned/infrastructure/repositories/pinned.repository-impl'
import { GetPinnedAuthorized_UseCase } from '@repositories/modules/pinned/domain/usecases/get-pinned-authorized.use-case'
import { pinned_actions } from '../../pinned/pinned.slice'

export const refresh_authorized_counts = (params: {
  last_authorized_counts_params: Counts_Params.Authorized
  ky: KyInstance
}) => {
  return async (dispatch: LibraryDispatch) => {
    const data_source = new Counts_DataSourceImpl(params.ky)
    const repository = new Counts_RepositoryImpl(data_source)
    const get_counts_use_case = new GetCountsOnAuthorizedUser_UseCase(
      repository,
    )

    dispatch(counts_actions.set_is_fetching(true))

    const result = await get_counts_use_case.invoke(
      params.last_authorized_counts_params,
    )

    // When a bookmark is archived or deleted, some pinned links might go away
    // so we need to refetch them. This is the best place to do it to avoid layout
    // shift after setting incoming bookmarks.
    const pinned_data_source = new Pinned_DataSourceImpl(params.ky)
    const pinned_repository = new Pinned_RepositoryImpl(pinned_data_source)
    const get_pinned_use_case = new GetPinnedAuthorized_UseCase(
      pinned_repository,
    )
    dispatch(pinned_actions.set_is_fetching(true))
    const pinned_result = await get_pinned_use_case.invoke()
    dispatch(pinned_actions.set_is_fetching(false))
    dispatch(pinned_actions.set_items(pinned_result))
    dispatch(pinned_actions.set_fetched_at_timestamp(Date.now()))

    dispatch(counts_actions.set_data(result))
    dispatch(counts_actions.set_is_fetching(false))
    dispatch(counts_actions.process_tags())
  }
}
