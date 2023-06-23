import { AxiosInstance, AxiosResponse } from 'axios'
import { BookmarksDataSource } from './bookmarks-data-source'
import { BookmarksDto } from '@shared/dtos/v1/bookmarks/bookmarks-on-user.dto'

export class BookmarksDataSourceImpl implements BookmarksDataSource {
  constructor(private axios: AxiosInstance) {}

  async getBookmarksOnCurrentUser({
    params,
  }: {
    params: BookmarksDto.QueryParams.OnCurrentUser
  }): Promise<BookmarksDto.Response.OnCurrentUser> {
    const response: AxiosResponse<BookmarksDto.Response.OnCurrentUser> =
      await this.axios.get('/v1/bookmarks', { params })

    return response.data
  }

  async getBookmarksOnOtherUser({
    username,
    params,
  }: {
    username: string
    params: BookmarksDto.QueryParams.OnOtherUser
  }): Promise<BookmarksDto.Response.OnOtherUser> {
    const response: AxiosResponse<BookmarksDto.Response.OnOtherUser> =
      await this.axios.get(`/v1/bookmarks/${username}`, { params })

    return response.data
  }
}
