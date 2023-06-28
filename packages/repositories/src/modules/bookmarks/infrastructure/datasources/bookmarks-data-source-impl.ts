import { AxiosInstance, AxiosResponse } from 'axios'
import { BookmarksDataSource } from './bookmarks-data-source'
import { BookmarksOnUserDto } from '@shared/dtos/modules/bookmarks/bookmarks-on-user.dto'

export class BookmarksDataSourceImpl implements BookmarksDataSource {
  constructor(private readonly axios: AxiosInstance) {}

  async getBookmarksOnCurrentUser({
    params,
  }: {
    params: BookmarksOnUserDto.QueryParams.Authorized
  }): Promise<BookmarksOnUserDto.Response.Authorized> {
    const response: AxiosResponse<BookmarksOnUserDto.Response.Authorized> =
      await this.axios.get('/v1/bookmarks', { params })

    return response.data
  }

  async getBookmarksOnOtherUser({
    username,
    params,
  }: {
    username: string
    params: BookmarksOnUserDto.QueryParams.Public
  }): Promise<BookmarksOnUserDto.Response.Public> {
    const response: AxiosResponse<BookmarksOnUserDto.Response.Public> =
      await this.axios.get(`/v1/bookmarks/${username}`, { params })

    return response.data
  }
}
