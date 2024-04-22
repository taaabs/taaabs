import { KyInstance } from 'ky'
import { LibraryDispatch } from '../../library.store'
import { Pinned_DataSourceImpl } from '@repositories/modules/pinned/infrastructure/data-sources/pinned.data-source-impl'
import { Pinned_RepositoryImpl } from '@repositories/modules/pinned/infrastructure/repositories/pinned.repository-impl'
import { pinned_actions } from '../pinned.slice'
import { GetPinned_Params } from '@repositories/modules/pinned/domain/types/get-pinned.params'

export const get_pinned_public = (params: {
  ky: KyInstance
  get_pinned_params: GetPinned_Params.Public
}) => {
  return async (dispatch: LibraryDispatch) => {
    const data_source = new Pinned_DataSourceImpl(params.ky)
    const repository = new Pinned_RepositoryImpl(data_source)

    dispatch(pinned_actions.set_is_fetching(true))

    const result = await repository.get_pinned_public(params.get_pinned_params)

    dispatch(pinned_actions.set_is_fetching(false))
    dispatch(pinned_actions.set_items(result))
    dispatch(pinned_actions.set_fetched_at_timestamp(Date.now()))
  }
}
