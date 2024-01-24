import { TagHierarchies_Dto } from '@shared/types/modules/tag-hierarchies/tag-hierarchies.dto'
import { GetTagHierarchies_Params } from '../../domain/types/get-tag-hierarchies.params'
import { UpdateTagHierarchies_Params } from '../../domain/types/update-tag-hierarchies.params'

export type TagHierarchies_DataSource = {
  get_tag_hierarchies_authorized(): Promise<TagHierarchies_Dto.Response.Authorized>

  get_tag_hierarchies_public(
    params: GetTagHierarchies_Params.Public,
  ): Promise<TagHierarchies_Dto.Response.Public>

  update_tag_hierarchies(params: UpdateTagHierarchies_Params): Promise<void>
}
