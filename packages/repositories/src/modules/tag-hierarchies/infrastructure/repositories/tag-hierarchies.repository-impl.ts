import { TagHierarchies_Dto } from '@shared/types/modules/tag-hierarchies/tag-hierarchies.dto'
import { TagHierarchy_Entity } from '../../domain/entities/tag-hierarchy.entity'
import { TagHierarchies_Repository } from '../../domain/repositories/tag-hierarchies.repository'
import { GetTagHierarchies_Ro } from '../../domain/types/get-tag-hierarchies.ro'
import { TagHierarchies_DataSource } from '../data-sources/tag-hierarchies.data-source'
import { GetTagHierarchies_Params } from '../../domain/types/get-tag-hierarchies.params'
import { UpdateTagHierarchies_Params } from '../../domain/types/update-tag-hierarchies.params'
import { AES } from '@repositories/utils/aes'

export class TagHierarchies_RepositoryImpl
  implements TagHierarchies_Repository
{
  constructor(
    private readonly _tag_hierarchies_data_source: TagHierarchies_DataSource,
  ) {}

  private async _parse_authorized_tree_node(
    node: TagHierarchies_Dto.AuthorizedNode,
    encryption_key: Uint8Array,
  ): Promise<TagHierarchy_Entity> {
    return {
      id: node.id,
      name: node.name
        ? node.name
        : node.name_aes
        ? await AES.decrypt(node.name_aes, encryption_key)
        : '',
      yields: node.yields,
      children: await Promise.all(
        node.children?.map(
          async (node) =>
            await this._parse_authorized_tree_node(node, encryption_key),
        ) || [],
      ),
    }
  }

  public async get_tag_hierarchies_authorized(
    params: GetTagHierarchies_Params.Authorized,
    encryption_key: Uint8Array,
  ): Promise<GetTagHierarchies_Ro> {
    const { tag_hierarchies, total } =
      await this._tag_hierarchies_data_source.get_tag_hierarchies_authorized(
        params,
      )

    return {
      tag_hierarchies: await Promise.all(
        tag_hierarchies.map(
          async (node) =>
            await this._parse_authorized_tree_node(node, encryption_key),
        ),
      ),
      total,
    }
  }

  public async get_tag_hierarchies_public(
    params: GetTagHierarchies_Params.Public,
  ): Promise<GetTagHierarchies_Ro> {
    const { tag_hierarchies, total } =
      await this._tag_hierarchies_data_source.get_tag_hierarchies_public(params)

    const parse_tree_node = (
      node: TagHierarchies_Dto.PublicNode,
    ): TagHierarchy_Entity => {
      return {
        id: node.id,
        name: node.name,
        yields: node.yields,
        children: node.children?.map((node) => parse_tree_node(node)) || [],
      }
    }

    return {
      tag_hierarchies: tag_hierarchies
        ? tag_hierarchies.map((node) => parse_tree_node(node))
        : undefined,
      total,
    }
  }

  public async update_tag_hierarchies(
    params: UpdateTagHierarchies_Params,
    encryption_key: Uint8Array,
  ): Promise<GetTagHierarchies_Ro> {
    const { tag_hierarchies, total } =
      await this._tag_hierarchies_data_source.update_tag_hierarchies(
        params,
        encryption_key,
      )

    return {
      tag_hierarchies: await Promise.all(
        tag_hierarchies.map((node) =>
          this._parse_authorized_tree_node(node, encryption_key),
        ),
      ),
      total,
    }
  }
}
