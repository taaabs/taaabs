import { BookmarksDataSource } from './bookmarks-data-source'
import { BookmarksDto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { BookmarksParams } from '../../domain/types/bookmarks.params'

export class BookmarksDataSourceImpl implements BookmarksDataSource {
  constructor(private readonly _apiUrl: string) {}

  public async getBookmarksOnAuthorizedUser(
    params: BookmarksParams.AuthorizedUser,
  ): Promise<BookmarksDto.Response.AuthorizedUser> {
    const queryParams: BookmarksDto.QueryParams.AuthorizedUser = {
      tags: params.tags?.join(','),
      category_id: params.categoryId,
      after: params.after,
      public_only: params.publicOnly,
      // TODO: pass remaining params
      // date_end:
      // date_range:
      // date_start:
      // sort_by:
    }

    const response = await fetch(
      `${this._apiUrl}/v1/bookmarks?${new URLSearchParams(
        JSON.parse(JSON.stringify(queryParams)),
      ).toString()}`,
    )

    return await response.json()
  }

  public async getBookmarksOnOtherUser(
    params: BookmarksParams.OtherUser,
  ): Promise<BookmarksDto.Response.OtherUser> {
    const queryParams: BookmarksDto.QueryParams.OtherUser = {
      tags: params.tags?.join(','),
      category_id: params.categoryId,
      after: params.after,
      filter: params.filter,
      order_by: params.orderBy,
      order: params.order,
      // TODO: pass remaining params
      // date_end:
      // date_range:
      // date_start:
    }

    const response = await fetch(
      `${this._apiUrl}/v1/bookmarks/${params.username}?${new URLSearchParams(
        JSON.parse(JSON.stringify(queryParams)),
      ).toString()}`,
    )

    return await response.json()
  }
}
