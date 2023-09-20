import { MonthsDto } from '@shared/types/modules/months/months.dto'
import { Months_Params } from '../../domain/types/months.params'
import { Months_DataSource } from './months.data-source'

export class Months_DataSourceImpl implements Months_DataSource {
  constructor(private readonly _apiUrl: string) {}

  public async get_months_on_authorized_user(
    params: Months_Params.Authorized,
  ): Promise<MonthsDto.Response.Authorized> {
    const queryParams: MonthsDto.QueryParams.Authorized = {
      filter: params.filter,
      category_id: params.category_id,
      public_only: params.public_only,
      tags: params.tags?.join(','),
    }

    return fetch(
      `${this._apiUrl}/v1/months?${new URLSearchParams(
        JSON.parse(JSON.stringify(queryParams)),
      ).toString()}`,
    ).then((r) => r.json())
  }

  public async get_months_on_public_user(
    params: Months_Params.Public,
  ): Promise<MonthsDto.Response.Public> {
    const queryParams: MonthsDto.QueryParams.Public = {
      filter: params.filter,
      category_id: params.category_id,
      tags: params.tags?.join(','),
    }

    return fetch(
      `${this._apiUrl}/v1/months/${params.username}?${new URLSearchParams(
        JSON.parse(JSON.stringify(queryParams)),
      ).toString()}`,
    ).then((r) => r.json())
  }
}
