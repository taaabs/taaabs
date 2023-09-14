import { BookmarksDataSource } from './bookmarks-data-source'
import { BookmarksDto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { BookmarksParams } from '../../domain/types/bookmarks.params'

export class BookmarksDataSourceImpl implements BookmarksDataSource {
  constructor(private readonly _api_url: string) {}

  public async get_bookmarks_on_authorized_user(
    params: BookmarksParams.Authorized,
  ): Promise<BookmarksDto.Response.Authorized> {
    const queryParams: BookmarksDto.QueryParams.Authorized = {
      tags: params.tags?.join(','),
      category_id: params.category_id,
      after: params.after,
      filter: params.filter,
      sort_by: params.sort_by,
      order: params.order,
      epoch_gte: params.yyyymm_gte
        ? new Date(
            parseInt(params.yyyymm_gte.toString().substring(0, 4)),
            parseInt(params.yyyymm_gte.toString().substring(4, 6)) - 1,
          ).getTime() / 1000
        : undefined,
      epoch_lte: params.yyyymm_lte
        ? new Date(
            parseInt(params.yyyymm_lte.toString().substring(0, 4)),
            parseInt(params.yyyymm_lte.toString().substring(4, 6)),
          ).getTime() / 1000
        : undefined,
      public_only: params.public_only,
    }

    return fetch(
      `${this._api_url}/v1/bookmarks?${new URLSearchParams(
        JSON.parse(JSON.stringify(queryParams)),
      ).toString()}`,
    ).then((r) => r.json())
  }

  public async get_bookmarks_on_public_user(
    params: BookmarksParams.Public,
  ): Promise<BookmarksDto.Response.Public> {
    const queryParams: BookmarksDto.QueryParams.Public = {
      tags: params.tags?.join(','),
      category_id: params.category_id,
      after: params.after,
      filter: params.filter,
      sort_by: params.sort_by,
      order: params.order,
      epoch_gte: params.yyyymm_gte
        ? new Date(
            parseInt(params.yyyymm_gte.toString().substring(0, 4)),
            parseInt(params.yyyymm_gte.toString().substring(4, 6)) - 1,
          ).getTime() / 1000
        : undefined,
      epoch_lte: params.yyyymm_lte
        ? new Date(
            parseInt(params.yyyymm_lte.toString().substring(0, 4)),
            parseInt(params.yyyymm_lte.toString().substring(4, 6)),
          ).getTime() / 1000
        : undefined,
    }

    return fetch(
      `${this._api_url}/v1/bookmarks/${params.username}?${new URLSearchParams(
        JSON.parse(JSON.stringify(queryParams)),
      ).toString()}`,
    ).then((r) => r.json())
  }
}
