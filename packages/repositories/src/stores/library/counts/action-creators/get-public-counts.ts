import { LibraryDispatch } from '../../library.store'
import { counts_actions } from '../counts.slice'
import { Counts_DataSourceImpl } from '@repositories/modules/counts/infrastructure/data-sources/counts.data-source-impl'
import { Counts_RepositoryImpl } from '@repositories/modules/counts/infrastructure/repositories/counts.repository-impl'
import { GetCountsOnPublicUser_UseCase } from '@repositories/modules/counts/domain/usecases/get-counts-on-public-user.use-case'
import { Counts_Params } from '@repositories/modules/counts/domain/types/counts.params'
import { KyInstance } from 'ky'

export const get_public_counts = (params: {
  request_params: Counts_Params.Public
  ky: KyInstance
}) => {
  return async (dispatch: LibraryDispatch) => {
    const data_source = new Counts_DataSourceImpl(params.ky)
    const repository = new Counts_RepositoryImpl(data_source)
    const get_months = new GetCountsOnPublicUser_UseCase(repository)

    dispatch(counts_actions.set_is_fetching(true))

    const result = await get_months.invoke(params.request_params)

    dispatch(counts_actions.set_data(result))

    dispatch(counts_actions.process_tags())
    dispatch(counts_actions.set_is_fetching(false))
    dispatch(counts_actions.set_should_refetch(false))
  }
}
