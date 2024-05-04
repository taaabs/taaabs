import { tag_hierarchies_actions } from '../tag-hierarchies.slice'
import { LibraryDispatch } from '../../library.store'
import { TagHierarchies_DataSourceImpl } from '@repositories/modules/tag-hierarchies/infrastructure/data-sources/tag-hierarchies.data-source-impl'
import { TagHierarchies_RepositoryImpl } from '@repositories/modules/tag-hierarchies/infrastructure/repositories/tag-hierarchies.repository-impl'
import { UpdateTagHierarchies_Params } from '@repositories/modules/tag-hierarchies/domain/types/update-tag-hierarchies.params'
import { KyInstance } from 'ky'

export const update_tag_hierarchies = (params: {
  update_tag_hierarchies_params: UpdateTagHierarchies_Params
  ky: KyInstance
  encryption_key: Uint8Array
}) => {
  return async (dispatch: LibraryDispatch) => {
    const data_source = new TagHierarchies_DataSourceImpl(params.ky)
    const repository = new TagHierarchies_RepositoryImpl(data_source)

    dispatch(tag_hierarchies_actions.set_is_updating(true))

    const { tag_hierarchies } = await repository.update_tag_hierarchies(
      params.update_tag_hierarchies_params,
      params.encryption_key,
    )

    dispatch(tag_hierarchies_actions.set_tag_hierarchies(tag_hierarchies))
    dispatch(tag_hierarchies_actions.set_is_updating(false))
  }
}
