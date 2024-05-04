import { UpdatePinned_Params } from '@repositories/modules/pinned/domain/types/update-pinned.params'
import { KyInstance } from 'ky'
import { LibraryDispatch } from '../../library.store'
import { Pinned_DataSourceImpl } from '@repositories/modules/pinned/infrastructure/data-sources/pinned.data-source-impl'
import { Pinned_RepositoryImpl } from '@repositories/modules/pinned/infrastructure/repositories/pinned.repository-impl'
import { pinned_actions } from '../pinned.slice'

export const update_pinned = (params: {
  update_pinned_params: UpdatePinned_Params
  ky: KyInstance
  encryption_key: Uint8Array
}) => {
  return async (dispatch: LibraryDispatch) => {
    const data_source = new Pinned_DataSourceImpl(params.ky)
    const repository = new Pinned_RepositoryImpl(data_source)

    dispatch(pinned_actions.set_is_updating(true))

    await repository.update_pinned(
      params.update_pinned_params,
      params.encryption_key,
    )

    dispatch(pinned_actions.set_is_updating(false))
  }
}
