import CryptoJS from 'crypto-js'
import { TagHierarchies_Dto } from '@shared/types/modules/tag-hierarchies/tag-hierarchies.dto'
import { TagHierarchyNode_Entity } from '../../domain/entities/tag-hierarchy-node.entity'
import { TagHierarchies_Repository } from '../../domain/repositories/tag-hierarchies.repository'
import { GetTagHierarchies_Ro } from '../../domain/types/get-tag-hierarchies.ro'
import { TagHierarchies_DataSource } from '../data-sources/tag-hierarchies.data-source'
import { GetTagHierarchies_Params } from '../../domain/types/get-tag-hierarchies.params'
import { UpdateTagHierarchies_Params } from '../../domain/types/update-tag-hierarchies.params'

export class TagHierarchies_RepositoryImpl
  implements TagHierarchies_Repository
{
  constructor(
    private readonly _tag_hierarchies_data_source: TagHierarchies_DataSource,
  ) {}

  private _parse_authorized_tree_node(
    node: TagHierarchies_Dto.AuthorizedNode,
  ): TagHierarchyNode_Entity {
    return {
      id: node.id,
      name: node.name
        ? node.name
        : node.name_aes
        ? CryptoJS.AES.decrypt(node.name_aes, 'my_secret_key').toString(
            CryptoJS.enc.Utf8,
          )
        : '',
      yields: node.yields,
      children:
        node.children?.map((node) => this._parse_authorized_tree_node(node)) ||
        [],
    }
  }

  public async get_tag_hierarchies_authorized(): Promise<GetTagHierarchies_Ro> {
    const { tree } =
      await this._tag_hierarchies_data_source.get_tag_hierarchies_authorized()

    return {
      tree: tree.map((node) => this._parse_authorized_tree_node(node)),
    }
  }

  public async get_tag_hierarchies_public(
    params: GetTagHierarchies_Params.Public,
  ): Promise<GetTagHierarchies_Ro> {
    const { tree } =
      await this._tag_hierarchies_data_source.get_tag_hierarchies_public(params)

    const parse_tree_node = (
      node: TagHierarchies_Dto.PublicNode,
    ): TagHierarchyNode_Entity => {
      return {
        id: node.id,
        name: node.name,
        yields: node.yields,
        children: node.children?.map((node) => parse_tree_node(node)) || [],
      }
    }

    return {
      tree: tree.map((node) => parse_tree_node(node)),
    }
  }

  public async update_tag_hierarchies(
    params: UpdateTagHierarchies_Params,
  ): Promise<GetTagHierarchies_Ro> {
    const { tree } =
      await this._tag_hierarchies_data_source.update_tag_hierarchies(params)

    return {
      tree: tree.map((node) => this._parse_authorized_tree_node(node)),
    }
  }
}
