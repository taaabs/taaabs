import { AxiosInstance, AxiosResponse } from 'axios'
import { BookmarksDataSource } from './bookmarks-data-source'
import { BookmarksDto } from '@shared/dtos/modules/bookmarks/bookmarks.dto'
import { BookmarksParams } from '../../domain/types/bookmarks.params'

export class BookmarksDataSourceImpl implements BookmarksDataSource {
  constructor(private readonly _axios: AxiosInstance) {}

  public async getAuthorized(
    params: BookmarksParams.Authorized,
  ): Promise<BookmarksDto.Response.Authorized> {
    const response: AxiosResponse<BookmarksDto.Response.Authorized> =
      await this._axios.get('/v1/bookmarks', { params })

    return response.data
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
    const response: AxiosResponse<BookmarksDto.Response.Public> =
      await this._axios.get(`/v1/bookmarks/${params.username}`, {
        params: queryParams,
      })

    return response.data
  }
}
