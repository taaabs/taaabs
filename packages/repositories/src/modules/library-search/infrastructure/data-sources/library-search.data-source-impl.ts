import { LibrarySearchBookmarks_Dto } from '@shared/types/modules/library-search/library-search-bookmarks.dto'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { LibrarySearch_DataSource } from './library-search.data-source'
import { LibrarySearchLastUpdated_Dto } from '@shared/types/modules/library-search/library-search-last-updated.dto'

export class LibrarySearch_DataSourceImpl implements LibrarySearch_DataSource {
  constructor(
    private readonly _api_url: string,
    private readonly _auth_token?: string,
  ) {}

  public async get_last_updated_on_authorized_user(): Promise<LibrarySearchLastUpdated_Dto.Response> {
    if (!this._auth_token)
      throw new Error(
        '[get_last_updated_on_authorized_user] Missing auth token.',
      )

    return fetch(`${this._api_url}/v1/library-search/last-updated-at`, {
      headers: {
        Authorization: `Bearer ${this._auth_token}`,
      },
    }).then((r) => r.json())
  }

  public async get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params,
  ): Promise<LibrarySearchBookmarks_Dto.Response.Authorized> {
    if (!this._auth_token)
      throw new Error(
        '[get_last_updated_on_authorized_user] Missing auth token.',
      )

    const query_params: LibrarySearchBookmarks_Dto.QueryParams = {
      is_archived: params.is_archived ? true : undefined,
    }

    return fetch(
      `${this._api_url}/v1/library-search/bookmarks?${new URLSearchParams(
        JSON.parse(JSON.stringify(query_params)),
      ).toString()}`,
      {
        headers: {
          Authorization: `Bearer ${this._auth_token}`,
        },
      },
    ).then((r) => r.json())
  }
}
