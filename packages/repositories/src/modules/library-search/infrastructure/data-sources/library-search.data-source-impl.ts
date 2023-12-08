import { LibrarySearchBookmarks_Dto } from '@shared/types/modules/library-search/library-search-bookmarks.dto'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { LibrarySearch_DataSource } from './library-search.data-source'
import { LibrarySearchLastUpdated_Dto } from '@shared/types/modules/library-search/library-search-last-updated.dto'
import { GetLastUpdated_Params } from '../../domain/types/get-last-updated.params'

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

  public async get_last_updated_on_public_user(
    params: GetLastUpdated_Params.Public,
  ): Promise<LibrarySearchLastUpdated_Dto.Response> {
    return fetch(
      `${this._api_url}/v1/library-search/last-updated-at/${params.username}`,
    ).then((r) => r.json())
  }

  public async get_bookmarks_on_authorized_user(): Promise<LibrarySearchBookmarks_Dto.Response.Authorized> {
    if (!this._auth_token)
      throw new Error(
        '[get_last_updated_on_authorized_user] Missing auth token.',
      )

    return fetch(`${this._api_url}/v1/library-search/bookmarks`, {
      headers: {
        Authorization: `Bearer ${this._auth_token}`,
      },
    }).then((r) => r.json())
  }

  public async get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<LibrarySearchBookmarks_Dto.Response.Public> {
    return fetch(
      `${this._api_url}/v1/library-search/bookmarks/${params.username}`,
    ).then((r) => r.json())
  }
}
