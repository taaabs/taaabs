import { GetTagHierarchies_Params } from '../types/get-tag-hierarchies.params'
import { GetTagHierarchies_Ro } from '../types/get-tag-hierarchies.ro'
import { UpdateTagHierarchies_Params } from '../types/update-tag-hierarchies.params'

export type TagHierarchies_Repository = {
  get_tag_hierarchies_authorized(
    params: GetTagHierarchies_Params.Authorized,
    encryption_key: Uint8Array,
  ): Promise<GetTagHierarchies_Ro>

  get_tag_hierarchies_public(
    params: GetTagHierarchies_Params.Public,
  ): Promise<GetTagHierarchies_Ro>

  update_tag_hierarchies(
    params: UpdateTagHierarchies_Params,
    encryption_key: Uint8Array,
  ): Promise<GetTagHierarchies_Ro>
}
