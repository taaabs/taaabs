import { LibrarySearchBookmarks_Dto } from '@shared/types/modules/library-search/library-search-bookmarks.dto'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { LibrarySearch_DataSource } from './library-search.data-source'
import { LibrarySearchLastUpdated_Dto } from '@shared/types/modules/library-search/library-search-last-updated.dto'
import { GetLastUpdatedAt_Params } from '../../domain/types/get-last-updated-at.params'
import { KyInstance } from 'ky'

export class LibrarySearch_DataSourceImpl implements LibrarySearch_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async get_last_updated_on_authorized_user(): Promise<LibrarySearchLastUpdated_Dto.Response> {
    return this._ky.get('v1/library-search/last-updated-at').json()
  }

  public async get_last_updated_on_public_user(
    params: GetLastUpdatedAt_Params.Public,
  ): Promise<LibrarySearchLastUpdated_Dto.Response> {
    return this._ky
      .get(`v1/library-search/last-updated-at/${params.username}`)
      .json()
  }

  public async get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<LibrarySearchBookmarks_Dto.Response.Authorized> {
    const search_params: LibrarySearchBookmarks_Dto.SearchParams = {
      is_archived: params.is_archived ? true : undefined,
    }

    return this._ky
      .get(`v1/library-search/bookmarks`, {
        searchParams: JSON.parse(JSON.stringify(search_params)),
      })
      .json()
  }

  public async get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<LibrarySearchBookmarks_Dto.Response.Public> {
    const search_params: LibrarySearchBookmarks_Dto.SearchParams = {
      is_archived: params.is_archived ? true : undefined,
    }

    return this._ky
      .get(`v1/library-search/bookmarks/${params.username}`, {
        searchParams: JSON.parse(JSON.stringify(search_params)),
      })
      .json()
  }
}
