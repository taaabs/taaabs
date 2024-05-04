import { KyInstance } from 'ky'
import { LibraryDispatch } from '../../library.store'
import { Pinned_DataSourceImpl } from '@repositories/modules/pinned/infrastructure/data-sources/pinned.data-source-impl'
import { Pinned_RepositoryImpl } from '@repositories/modules/pinned/infrastructure/repositories/pinned.repository-impl'
import { pinned_actions } from '../pinned.slice'

export const get_pinned_authorized = (params: {
  ky: KyInstance
  encryption_key: Uint8Array
}) => {
  return async (dispatch: LibraryDispatch) => {
    const data_source = new Pinned_DataSourceImpl(params.ky)
    const repository = new Pinned_RepositoryImpl(data_source)

    dispatch(pinned_actions.set_is_fetching(true))

    const result = await repository.get_pinned_authorized(params.encryption_key)

    dispatch(pinned_actions.set_is_fetching(false))
    dispatch(pinned_actions.set_items(result))
    dispatch(pinned_actions.set_fetched_at_timestamp(Date.now()))
  }
}
