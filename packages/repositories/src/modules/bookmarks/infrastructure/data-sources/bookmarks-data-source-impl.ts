import { BookmarksDataSource } from './bookmarks-data-source'
import { BookmarksDto } from '@shared/dtos/modules/bookmarks/bookmarks.dto'
import { BookmarksParams } from '../../domain/types/bookmarks.params'
import queryString from 'query-string'

export class BookmarksDataSourceImpl implements BookmarksDataSource {
  constructor(private readonly _apiUrl: string) {}

  public async getAuthorized(
    params: BookmarksParams.Authorized,
  ): Promise<BookmarksDto.Response.Authorized> {
    const queryParams: BookmarksDto.QueryParams.Public = {
      tags: params.tags?.join(','),
      category_id: params.categoryId,
      after: params.after,
      archived: params.archived,
      nsfw: params.nsfw,
      starred_only: params.starredOnly,
      // TODO: pass remaining params
      // date_end:
      // date_range:
      // date_start:
      // sort_by:
    }

    const response = await fetch(
      `${this._apiUrl}/v1/bookmarks?${queryString.stringify(queryParams)}`,
    )

    return await response.json()
  }

  public async getPublic(
    params: BookmarksParams.Public,
  ): Promise<BookmarksDto.Response.Public> {
    const queryParams: BookmarksDto.QueryParams.Public = {
      tags: params.tags?.join(','),
      category_id: params.categoryId,
      after: params.after,
      archived: params.archived,
      nsfw: params.nsfw,
      starred_only: params.starredOnly,
      // TODO: pass remaining params
      // date_end:
      // date_range:
      // date_start:
      // sort_by:
    }
    const response = await fetch(
      `${this._apiUrl}/v1/bookmarks/${params.username}?${queryString.stringify(
        queryParams,
      )}`,
    )

    return await response.json()
  }
}
