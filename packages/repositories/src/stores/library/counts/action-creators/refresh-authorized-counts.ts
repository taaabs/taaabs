import { LibraryDispatch } from '../../library.store'
import { counts_actions } from '../counts.slice'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'
import { Counts_DataSourceImpl } from '@repositories/modules/counts/infrastructure/data-sources/counts.data-source-impl'
import { Counts_RepositoryImpl } from '@repositories/modules/counts/infrastructure/repositories/counts.repository-impl'
import { KyInstance } from 'ky'

export const refresh_authorized_counts = (params: {
  last_authorized_counts_params: Counts_Params.Authorized
  ky: KyInstance
  encryption_key: Uint8Array
}) => {
  return async (dispatch: LibraryDispatch) => {
    const data_source = new Counts_DataSourceImpl(params.ky)
    const repository = new Counts_RepositoryImpl(data_source)

    dispatch(counts_actions.set_is_fetching(true))

    const result = await repository.get_counts_on_authorized_user(
      params.last_authorized_counts_params,
      params.encryption_key,
    )

    dispatch(counts_actions.set_data(result))
    dispatch(counts_actions.set_fetched_at_timestamp(Date.now()))
    dispatch(counts_actions.set_is_fetching(false))
    dispatch(counts_actions.process_tags())
  }
}
