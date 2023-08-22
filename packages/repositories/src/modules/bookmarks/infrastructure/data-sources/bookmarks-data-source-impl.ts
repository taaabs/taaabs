import { BookmarksDataSource } from './bookmarks-data-source'
import { BookmarksDto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { BookmarksParams } from '../../domain/types/bookmarks.params'

export class BookmarksDataSourceImpl implements BookmarksDataSource {
  constructor(private readonly _apiUrl: string) {}

  public async getBookmarksOnAuthorizedUser(
    params: BookmarksParams.Authorized,
  ): Promise<BookmarksDto.Response.Authorized> {
    const queryParams: BookmarksDto.QueryParams.Authorized = {
      tags: params.tags?.join(','),
      category_id: params.categoryId,
      after: params.after,
      filter: params.filter,
      sort_by: params.sortBy,
      sort: params.sort,
      epoch_gte: params.yyyymmGte
        ? new Date(
            parseInt(params.yyyymmGte.toString().substring(0, 4)),
            parseInt(params.yyyymmGte.toString().substring(4, 6)) - 1,
          ).getTime() / 1000
        : undefined,
      epoch_lte: params.yyyymmLte
        ? new Date(
            parseInt(params.yyyymmLte.toString().substring(0, 4)),
            parseInt(params.yyyymmLte.toString().substring(4, 6)),
          ).getTime() / 1000
        : undefined,
      public_only: params.publicOnly,
    }

    return fetch(
      `${this._apiUrl}/v1/bookmarks?${new URLSearchParams(
        JSON.parse(JSON.stringify(queryParams)),
      ).toString()}`,
    ).then((r) => r.json())
  }

  public async getBookmarksOnPublicUser(
    params: BookmarksParams.Public,
  ): Promise<BookmarksDto.Response.Public> {
    const queryParams: BookmarksDto.QueryParams.Public = {
      tags: params.tags?.join(','),
      category_id: params.categoryId,
      after: params.after,
      filter: params.filter,
      sort_by: params.sortBy,
      sort: params.sort,
      epoch_gte: params.yyyymmGte
        ? new Date(
            parseInt(params.yyyymmGte.toString().substring(0, 4)),
            parseInt(params.yyyymmGte.toString().substring(4, 6)) - 1,
          ).getTime() / 1000
        : undefined,
      epoch_lte: params.yyyymmLte
        ? new Date(
            parseInt(params.yyyymmLte.toString().substring(0, 4)),
            parseInt(params.yyyymmLte.toString().substring(4, 6)),
          ).getTime() / 1000
        : undefined,
    }

    return fetch(
      `${this._apiUrl}/v1/bookmarks/${params.username}?${new URLSearchParams(
        JSON.parse(JSON.stringify(queryParams)),
      ).toString()}`,
    ).then((r) => r.json())
  }
}
