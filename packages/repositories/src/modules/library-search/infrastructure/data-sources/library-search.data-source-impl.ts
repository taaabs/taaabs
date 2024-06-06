import { LibrarySearchBookmarks_Dto } from '@shared/types/modules/library-search/library-search-bookmarks.dto'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { LibrarySearch_DataSource } from './library-search.data-source'
import { KyInstance } from 'ky'

export class LibrarySearch_DataSourceImpl implements LibrarySearch_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<LibrarySearchBookmarks_Dto.Response.Authorized> {
    const search_params: LibrarySearchBookmarks_Dto.SearchParams = {
      is_archived: params.is_archived ? true : undefined,
      after: params.after,
      include_points: params.include_points,
      include_visited_at: params.include_visited_at,
    }

    return this._ky
      .get(`v1/library-search/bookmarks`, {
        searchParams: JSON.parse(JSON.stringify(search_params)),
        timeout: false,
      })
      .json()
  }

  public async get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<LibrarySearchBookmarks_Dto.Response.Public> {
    const search_params: LibrarySearchBookmarks_Dto.SearchParams = {
      is_archived: params.is_archived ? true : undefined,
      after: params.after,
      include_points: params.include_points,
    }

    return this._ky
      .get(`v1/library-search/bookmarks/${params.username}`, {
        searchParams: JSON.parse(JSON.stringify(search_params)),
        timeout: false,
      })
      .json()
  }
}
