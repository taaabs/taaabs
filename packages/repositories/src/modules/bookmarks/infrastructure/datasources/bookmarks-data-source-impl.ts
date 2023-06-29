import { AxiosInstance, AxiosResponse } from 'axios'
import { BookmarksDataSource } from './bookmarks-data-source'
import { BookmarksDto } from '@shared/dtos/modules/bookmarks/bookmarks.dto'

export class BookmarksDataSourceImpl implements BookmarksDataSource {
  constructor(private readonly axios: AxiosInstance) {}

  async getBookmarksOnCurrentUser({
    params,
  }: {
    params: BookmarksDto.QueryParams.Authorized
  }): Promise<BookmarksDto.Response.Authorized> {
    const response: AxiosResponse<BookmarksDto.Response.Authorized> =
      await this.axios.get('/v1/bookmarks', { params })

    return response.data
  }

  async getBookmarksOnOtherUser({
    username,
    params,
  }: {
    username: string
    params: BookmarksDto.QueryParams.Public
  }): Promise<BookmarksDto.Response.Public> {
    const response: AxiosResponse<BookmarksDto.Response.Public> =
      await this.axios.get(`/v1/bookmarks/${username}`, { params })

    return response.data
  }
}
