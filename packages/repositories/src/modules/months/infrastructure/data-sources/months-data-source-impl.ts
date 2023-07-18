import { MonthsDto } from '@shared/types/modules/months/months.dto'
import { MonthsParams } from '../../domain/types/months.params'
import { MonthsDataSource } from './months-data-source'

export class MonthsDataSourceImpl implements MonthsDataSource {
  constructor(private readonly _apiUrl: string) {}

  public async getMonthsOnAuthorizedUser(
    params: MonthsParams.Authorized,
  ): Promise<MonthsDto.Response.Authorized> {
    const queryParams: MonthsDto.QueryParams.Authorized = {
      filter: params.filter,
      category_id: params.categoryId,
      public_only: params.publicOnly,
      tags: params.tags?.join(','),
    }

    return fetch(
      `${this._apiUrl}/v1/months?${new URLSearchParams(
        JSON.parse(JSON.stringify(queryParams)),
      ).toString()}`,
    ).then((r) => r.json())
  }

  public async getMonthsOnPublicUser(
    params: MonthsParams.Public,
  ): Promise<MonthsDto.Response.Public> {
    const queryParams: MonthsDto.QueryParams.Public = {
      filter: params.filter,
      category_id: params.categoryId,
      tags: params.tags?.join(','),
    }

    return fetch(
      `${this._apiUrl}/v1/months/${params.username}?${new URLSearchParams(
        JSON.parse(JSON.stringify(queryParams)),
      ).toString()}`,
    ).then((r) => r.json())
  }
}
