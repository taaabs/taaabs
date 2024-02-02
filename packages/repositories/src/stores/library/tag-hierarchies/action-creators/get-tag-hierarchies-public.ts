import { TagHierarchies_DataSourceImpl } from '@repositories/modules/tag-hierarchies/infrastructure/data-sources/tag-hierarchies.data-source-impl'
import { LibraryDispatch } from '../../library.store'
import { TagHierarchies_RepositoryImpl } from '@repositories/modules/tag-hierarchies/infrastructure/repositories/tag-hierarchies.repository-impl'
import { tag_hierarchies_actions } from '../tag-hierarchies.slice'
import { GetTagHierarchiesPublic_UseCase } from '@repositories/modules/tag-hierarchies/domain/usecases/get-tag-hierarchies-public.use-case'
import { GetTagHierarchies_Params } from '@repositories/modules/tag-hierarchies/domain/types/get-tag-hierarchies.params'

export const get_tag_hierarchies_public = (params: {
  request_params: GetTagHierarchies_Params.Public
  api_url: string
  auth_token: string
}) => {
  return async (dispatch: LibraryDispatch) => {
    const data_source = new TagHierarchies_DataSourceImpl(
      params.api_url,
      params.auth_token,
    )
    const repository = new TagHierarchies_RepositoryImpl(data_source)
    const get_tag_hierarchies = new GetTagHierarchiesPublic_UseCase(repository)

    dispatch(tag_hierarchies_actions.set_is_fetching_data(true))

    const { tree, total } = await get_tag_hierarchies.invoke(
      params.request_params,
    )

    dispatch(tag_hierarchies_actions.set_tree(tree))
    dispatch(tag_hierarchies_actions.set_total(total))
    dispatch(tag_hierarchies_actions.set_is_fetching_data(false))
    dispatch(tag_hierarchies_actions.set_is_initialized(true))
  }
}
