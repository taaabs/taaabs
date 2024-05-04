import { TagHierarchies_Dto } from '@shared/types/modules/tag-hierarchies/tag-hierarchies.dto'
import { TagHierarchies_DataSource } from './tag-hierarchies.data-source'
import { GetTagHierarchies_Params } from '../../domain/types/get-tag-hierarchies.params'
import { UpdateTagHierarchies_Params } from '../../domain/types/update-tag-hierarchies.params'
import { TagHierarchy_Entity } from '../../domain/entities/tag-hierarchy.entity'
import { UpdateTagHierarchies_Dto } from '@shared/types/modules/tag-hierarchies/update-tag-hierarchies.dto'
import { Crypto } from '@repositories/utils/crypto'
import { KyInstance } from 'ky'

export class TagHierarchies_DataSourceImpl
  implements TagHierarchies_DataSource
{
  constructor(private readonly _ky: KyInstance) {}

  public async get_tag_hierarchies_authorized(
    params: GetTagHierarchies_Params.Authorized,
  ): Promise<TagHierarchies_Dto.Response.Authorized> {
    const search_params: GetTagHierarchies_Params.Authorized = {
      starred_only: params.starred_only,
      unread_only: params.unread_only,
      is_archived: params.is_archived,
      gte: params.gte,
      lte: params.lte,
    }

    return this._ky
      .get('v1/tag-hierarchies', {
        searchParams: JSON.parse(JSON.stringify(search_params)),
      })
      .json()
  }

  public async get_tag_hierarchies_public(
    params: GetTagHierarchies_Params.Public,
  ): Promise<TagHierarchies_Dto.Response.Public> {
    const search_params: GetTagHierarchies_Params.Authorized = {
      starred_only: params.starred_only,
      is_archived: params.is_archived,
      gte: params.gte,
      lte: params.lte,
    }

    return this._ky
      .get(`v1/tag-hierarchies/${params.username}`, {
        searchParams: JSON.parse(JSON.stringify(search_params)),
      })
      .json()
  }

  public async update_tag_hierarchies(
    params: UpdateTagHierarchies_Params,
    encryption_key: Uint8Array,
  ): Promise<TagHierarchies_Dto.Response.Authorized> {
    const parse_node = async (
      node: TagHierarchy_Entity,
    ): Promise<UpdateTagHierarchies_Dto.Node> => {
      return {
        hash: await Crypto.SHA256(node.name, encryption_key),
        children: await Promise.all(
          node.children.map(async (node) => await parse_node(node)),
        ),
      }
    }

    const search_params: GetTagHierarchies_Params.Authorized = {
      starred_only: params.starred_only,
      unread_only: params.unread_only,
      is_archived: params.is_archived,
      gte: params.gte,
      lte: params.lte,
    }

    const body: UpdateTagHierarchies_Dto.Body = {
      tag_hierarchies: await Promise.all(
        params.tag_hierarchies.map(async (node) => await parse_node(node)),
      ),
    }

    return this._ky
      .put('v1/tag-hierarchies', {
        searchParams: JSON.parse(JSON.stringify(search_params)),
        body: JSON.stringify(body),
      })
      .json()
  }
}
