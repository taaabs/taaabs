import { LibraryDispatch } from '../../library.store'
import { counts_actions } from '../counts.slice'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'
import { Counts_DataSourceImpl } from '@repositories/modules/counts/infrastructure/data-sources/counts.data-source-impl'
import { Counts_RepositoryImpl } from '@repositories/modules/counts/infrastructure/repositories/counts.repository-impl'
import { GetCountsOnAuthorizedUser_UseCase } from '@repositories/modules/counts/domain/usecases/get-counts-on-authorized-user.use-case'
import { KyInstance } from 'ky'

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

    dispatch(counts_actions.set_data(result))
    dispatch(counts_actions.set_is_fetching(false))
    dispatch(counts_actions.process_tags())
  }
}
