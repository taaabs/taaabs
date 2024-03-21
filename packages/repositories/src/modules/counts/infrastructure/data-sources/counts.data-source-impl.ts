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
  ): Promise<Counts_Dto.Response.Authorized> {
    const query_params: Counts_Dto.QueryParams.Authorized = {
      starred_only: params.starred_only,
      unread_only: params.unread_only,
      is_archived: params.is_archived,
      public_only: params.public_only,
      tags: params.tags?.join(','),
    }

    return await fetch(
      `${this._api_url}/v1/counts?${new URLSearchParams(
        JSON.parse(JSON.stringify(query_params)),
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
  ): Promise<Counts_Dto.Response.Public> {
    const queryParams: Counts_Dto.QueryParams.Public = {
      starred_only: params.starred_only,
      is_archived: params.is_archived,
      tags: params.tags?.join(','),
    }

    return fetch(
      `${this._api_url}/v1/counts/${params.username}?${new URLSearchParams(
        JSON.parse(JSON.stringify(queryParams)),
      ).toString()}`,
    ).then((r) => r.json())
  }
}
