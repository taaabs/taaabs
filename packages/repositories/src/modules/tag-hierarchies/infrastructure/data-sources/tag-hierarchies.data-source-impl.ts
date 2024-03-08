import { TagHierarchies_Dto } from '@shared/types/modules/tag-hierarchies/tag-hierarchies.dto'
import { TagHierarchies_DataSource } from './tag-hierarchies.data-source'
import { GetTagHierarchies_Params } from '../../domain/types/get-tag-hierarchies.params'
import { UpdateTagHierarchies_Params } from '../../domain/types/update-tag-hierarchies.params'
import { TagHierarchyNode_Entity } from '../../domain/entities/tag-hierarchy-node.entity'
import { UpdateTagHierarchies_Dto } from '@shared/types/modules/tag-hierarchies/update-tag-hierarchies.dto'
import { Crypto } from '@repositories/utils/crypto'

export class TagHierarchies_DataSourceImpl
  implements TagHierarchies_DataSource
{
  constructor(
    private readonly _api_url: string,
    private readonly _auth_token: string,
  ) {}

  public async get_tag_hierarchies_authorized(
    params: GetTagHierarchies_Params.Authorized,
  ): Promise<TagHierarchies_Dto.Response.Authorized> {
    const query_params: GetTagHierarchies_Params.Authorized = {
      starred_only: params.starred_only,
      unread_only: params.unread_only,
      is_archived: params.is_archived,
      gte: params.gte,
      lte: params.lte,
    }

    return fetch(
      `${this._api_url}/v1/tag-hierarchies?${new URLSearchParams(
        JSON.parse(JSON.stringify(query_params)),
      ).toString()}`,
      {
        headers: {
          Authorization: `Bearer ${this._auth_token}`,
        },
      },
    ).then((r) => r.json())
  }

  public async get_tag_hierarchies_public(
    params: GetTagHierarchies_Params.Public,
  ): Promise<TagHierarchies_Dto.Response.Public> {
    const query_params: GetTagHierarchies_Params.Authorized = {
      starred_only: params.starred_only,
      is_archived: params.is_archived,
      gte: params.gte,
      lte: params.lte,
    }

    return fetch(
      `${this._api_url}/v1/tag-hierarchies/${
        params.username
      }?${new URLSearchParams(
        JSON.parse(JSON.stringify(query_params)),
      ).toString()}`,
    ).then((r) => r.json())
  }

  public async update_tag_hierarchies(
    params: UpdateTagHierarchies_Params,
  ): Promise<TagHierarchies_Dto.Response.Authorized> {
    const key = await Crypto.derive_key_from_password('my_secret_key')
    const parse_node = async (
      node: TagHierarchyNode_Entity,
    ): Promise<UpdateTagHierarchies_Dto.Node> => {
      return {
        hash: await Crypto.SHA256(node.name, key),
        children: await Promise.all(
          node.children.map(async (node) => await parse_node(node)),
        ),
      }
    }

    const query_params: GetTagHierarchies_Params.Authorized = {
      starred_only: params.starred_only,
      unread_only: params.unread_only,
      is_archived: params.is_archived,
      gte: params.gte,
      lte: params.lte,
    }

    const body: UpdateTagHierarchies_Dto.Body = {
      tree: await Promise.all(
        params.tree.map(async (node) => await parse_node(node)),
      ),
    }

    return await fetch(
      `${this._api_url}/v1/tag-hierarchies?${new URLSearchParams(
        JSON.parse(JSON.stringify(query_params)),
      ).toString()}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this._auth_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    ).then((r) => r.json())
  }
}
