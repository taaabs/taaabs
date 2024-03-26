import { KyInstance } from 'ky'
import { LibraryDispatch } from '../../library.store'
import { Pinned_DataSourceImpl } from '@repositories/modules/pinned/infrastructure/data-sources/pinned.data-source-impl'
import { Pinned_RepositoryImpl } from '@repositories/modules/pinned/infrastructure/repositories/pinned.repository-impl'
import { GetPinnedAuthorized_UseCase } from '@repositories/modules/pinned/domain/usecases/get-pinned-authorized.use-case'
import { pinned_actions } from '../pinned.slice'

export const get_pinned_authorized = (params: { ky: KyInstance }) => {
  return async (dispatch: LibraryDispatch) => {
    const data_source = new Pinned_DataSourceImpl(params.ky)
    const repository = new Pinned_RepositoryImpl(data_source)
    const get_pinned = new GetPinnedAuthorized_UseCase(repository)

    dispatch(pinned_actions.set_is_fetching(true))

    const result = await get_pinned.invoke()

    dispatch(pinned_actions.set_items(result))
    dispatch(pinned_actions.set_is_fetching(false))
    dispatch(pinned_actions.set_fetched_at_timestamp(Date.now()))
  }
}
