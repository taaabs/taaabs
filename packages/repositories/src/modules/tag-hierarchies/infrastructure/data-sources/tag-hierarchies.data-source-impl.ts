import CryptoJS from 'crypto-js'
import { TagHierarchies_Dto } from '@shared/types/modules/tag-hierarchies/tag-hierarchies.dto'
import { TagHierarchies_DataSource } from './tag-hierarchies.data-source'
import { GetTagHierarchies_Params } from '../../domain/types/get-tag-hierarchies.params'
import { UpdateTagHierarchies_Params } from '../../domain/types/update-tag-hierarchies.params'
import { TagHierarchyNode_Entity } from '../../domain/entities/tag-hierarchy-node.entity'
import { UpdateTagHierarchies_Dto } from '@shared/types/modules/tag-hierarchies/update-tag-hierarchies.dto'

export class TagHierarchies_DataSourceImpl
  implements TagHierarchies_DataSource
{
  constructor(
    private readonly _api_url: string,
    private readonly _auth_token: string,
  ) {}

  public async get_tag_hierarchies_authorized(): Promise<TagHierarchies_Dto.Response.Authorized> {
    return fetch(`${this._api_url}/v1/tag-hierarchies`, {
      headers: {
        Authorization: `Bearer ${this._auth_token}`,
      },
    }).then((r) => r.json())
  }

  public async get_tag_hierarchies_public(
    params: GetTagHierarchies_Params.Public,
  ): Promise<TagHierarchies_Dto.Response.Public> {
    return fetch(`${this._api_url}/v1/tag-hierarchies/${params.username}`).then(
      (r) => r.json(),
    )
  }

  public async update_tag_hierarchies(
    params: UpdateTagHierarchies_Params,
  ): Promise<TagHierarchies_Dto.Response.Authorized> {
    const parse_node = (
      node: TagHierarchyNode_Entity,
    ): UpdateTagHierarchies_Dto.Node => {
      return {
        hash: CryptoJS.SHA256(node.name + 'my_secret_key').toString(),
        children: node.children.map((node) => parse_node(node)),
      }
    }

    const body: UpdateTagHierarchies_Dto.Body = {
      tree: params.tree.map((node) => parse_node(node)),
    }

    return fetch(`${this._api_url}/v1/tag-hierarchies`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this._auth_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((r) => {
      if (r.ok) {
        return r.json()
      } else {
        throw new Error()
      }
    })
  }
}
