import { Counts_Dto } from '@shared/types/modules/counts/counts.dto'
import { Counts_Params } from '../../domain/types/counts.params'
import { Counts_DataSource } from './counts.data-source'

export class Counts_DataSourceImpl implements Counts_DataSource {
  constructor(
    private readonly _api_url: string,
    private readonly _auth_token: string,
  ) {}

  public async get_counts_on_authorized_user(
    params: Counts_Params.Authorized,
  ): Promise<Counts_Dto.Response> {
    const queryParams: Counts_Dto.QueryParams.Authorized = {
      filter: params.filter,
      category_id: params.category_id,
      public_only: params.public_only,
      tags: params.tags?.join(','),
    }

    return fetch(
      `${this._api_url}/v1/counts?${new URLSearchParams(
        JSON.parse(JSON.stringify(queryParams)),
      ).toString()}`,
      {
        headers: {
          Authorization: `Bearer ${this._auth_token}`,
        },
      },
    ).then((r) => r.json())
  }

  public async get_counts_on_public_user(
    params: Counts_Params.Public,
  ): Promise<Counts_Dto.Response> {
    const queryParams: Counts_Dto.QueryParams.Public = {
      filter: params.filter,
      category_id: params.category_id,
      tags: params.tags?.join(','),
    }

    return fetch(
      `${this._api_url}/v1/counts/${params.username}?${new URLSearchParams(
        JSON.parse(JSON.stringify(queryParams)),
      ).toString()}`,
    ).then((r) => r.json())
  }
}
