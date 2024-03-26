import { UpdatePinned_Params } from '@repositories/modules/pinned/domain/types/update-pinned.params'
import { KyInstance } from 'ky'
import { LibraryDispatch } from '../../library.store'
import { Pinned_DataSourceImpl } from '@repositories/modules/pinned/infrastructure/data-sources/pinned.data-source-impl'
import { Pinned_RepositoryImpl } from '@repositories/modules/pinned/infrastructure/repositories/pinned.repository-impl'
import { UpdatePinned_UseCase } from '@repositories/modules/pinned/domain/usecases/update-pinned.use-case'
import { pinned_actions } from '../pinned.slice'

export const update_pinned = (params: {
  update_pinned_params: UpdatePinned_Params
  ky: KyInstance
}) => {
  return async (dispatch: LibraryDispatch) => {
    const data_source = new Pinned_DataSourceImpl(params.ky)
    const repository = new Pinned_RepositoryImpl(data_source)
    const update_pinned_use_case = new UpdatePinned_UseCase(repository)

    dispatch(pinned_actions.set_is_updating(true))

    await update_pinned_use_case.invoke(params.update_pinned_params)

    dispatch(pinned_actions.set_is_updating(false))
  }
}
