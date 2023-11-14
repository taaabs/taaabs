import { Months_Dto } from '@shared/types/modules/months/months.dto'
import { Months_Params } from '../../domain/types/months.params'
import { Months_DataSource } from './months.data-source'

export class Months_DataSourceImpl implements Months_DataSource {
  constructor(
    private readonly _api_url: string,
    private readonly _auth_token: string,
  ) {}

  public async get_months_on_authorized_user(
    params: Months_Params.Authorized,
  ): Promise<Months_Dto.Response> {
    const queryParams: Months_Dto.QueryParams.Authorized = {
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

  public async get_months_on_public_user(
    params: Months_Params.Public,
  ): Promise<Months_Dto.Response> {
    const queryParams: Months_Dto.QueryParams.Public = {
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
