import { tag_hierarchies_actions } from '../tag-hierarchies.slice'
import { LibraryDispatch } from '../../library.store'
import { TagHierarchies_DataSourceImpl } from '@repositories/modules/tag-hierarchies/infrastructure/data-sources/tag-hierarchies.data-source-impl'
import { TagHierarchies_RepositoryImpl } from '@repositories/modules/tag-hierarchies/infrastructure/repositories/tag-hierarchies.repository-impl'
import { UpdateTagHierarchies_UseCase } from '@repositories/modules/tag-hierarchies/domain/usecases/update-tag-hierarchies.use-case'
import { UpdateTagHierarchies_Params } from '@repositories/modules/tag-hierarchies/domain/types/update-tag-hierarchies.params'
import { KyInstance } from 'ky'

export const update_tag_hierarchies = (params: {
  update_tag_hierarchies_params: UpdateTagHierarchies_Params
  ky: KyInstance
}) => {
  return async (dispatch: LibraryDispatch) => {
    const data_source = new TagHierarchies_DataSourceImpl(params.ky)
    const repository = new TagHierarchies_RepositoryImpl(data_source)
    const update_tag_hierarchies_use_case = new UpdateTagHierarchies_UseCase(
      repository,
    )

    dispatch(tag_hierarchies_actions.set_is_updating(true))

    const { tree } = await update_tag_hierarchies_use_case.invoke(
      params.update_tag_hierarchies_params,
    )

    dispatch(tag_hierarchies_actions.set_tree(tree))
    dispatch(tag_hierarchies_actions.set_is_updating(false))
  }
}
