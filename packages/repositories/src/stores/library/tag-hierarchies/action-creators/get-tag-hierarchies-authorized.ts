import { TagHierarchies_DataSourceImpl } from '@repositories/modules/tag-hierarchies/infrastructure/data-sources/tag-hierarchies.data-source-impl'
import { LibraryDispatch } from '../../library.store'
import { TagHierarchies_RepositoryImpl } from '@repositories/modules/tag-hierarchies/infrastructure/repositories/tag-hierarchies.repository-impl'
import { GetTagHierarchiesAuthorized_UseCase } from '@repositories/modules/tag-hierarchies/domain/usecases/get-tag-hierarchies-authorized.use-case'
import { tag_hierarchies_actions } from '../tag-hierarchies.slice'
import { GetTagHierarchies_Params } from '@repositories/modules/tag-hierarchies/domain/types/get-tag-hierarchies.params'
import { KyInstance } from 'ky'

export const get_tag_hierarchies_authorized = (params: {
  request_params: GetTagHierarchies_Params.Authorized
  ky: KyInstance
}) => {
  return async (dispatch: LibraryDispatch) => {
    const data_source = new TagHierarchies_DataSourceImpl(params.ky)
    const repository = new TagHierarchies_RepositoryImpl(data_source)
    const get_tag_hierarchies = new GetTagHierarchiesAuthorized_UseCase(
      repository,
    )

    dispatch(tag_hierarchies_actions.set_is_fetching_data(true))

    const { tag_hierarchies, total } = await get_tag_hierarchies.invoke(
      params.request_params,
    )

    dispatch(tag_hierarchies_actions.set_tag_hierarchies(tag_hierarchies))
    dispatch(tag_hierarchies_actions.set_total(total))
    dispatch(tag_hierarchies_actions.set_is_fetching_data(false))
    dispatch(tag_hierarchies_actions.set_is_initialized(true))
  }
}
