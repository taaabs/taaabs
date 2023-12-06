import { LibrarySearchBookmarks_Dto } from '@shared/types/modules/library-search/library-search-bookmarks.dto'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { LibrarySearch_DataSource } from './library-search.data-source'
import { LastUpdated_Dto } from '@shared/types/modules/library-search/last-updated.dto'
import { GetLastUpdated_Params } from '../../domain/types/get-last-updated.params'

export class LibrarySearch_DataSourceImpl implements LibrarySearch_DataSource {
  constructor(
    private readonly _api_url: string,
    private readonly _auth_token?: string,
  ) {}

  public get_last_updated_on_authorized_user(
    params: GetLastUpdated_Params.Authorized,
  ): Promise<LastUpdated_Dto.Response> {
    if (!this._auth_token)
      throw new Error(
        '[get_last_updated_on_authorized_user] Missing auth token.',
      )

    const query_params: LastUpdated_Dto.QueryParams.Authorized = {
      is_archived: params.is_archived ? params.is_archived : undefined,
      public_only: params.public_only ? params.public_only : undefined,
    }
    return fetch(
      `${this._api_url}/v1/library-search/last-updated-at?${new URLSearchParams(
        JSON.parse(JSON.stringify(query_params)),
      ).toString()}`,
      {
        headers: {
          Authorization: `Bearer ${this._auth_token}`,
        },
      },
    ).then((r) => r.json())
  }

  public get_last_updated_on_public_user(
    params: GetLastUpdated_Params.Public,
  ): Promise<LastUpdated_Dto.Response> {
    const query_params: LastUpdated_Dto.QueryParams.Public = {
      is_archived: params.is_archived ? params.is_archived : undefined,
    }
    return fetch(
      `${this._api_url}/v1/library-search/last-updated-at/${
        params.username
      }?${new URLSearchParams(
        JSON.parse(JSON.stringify(query_params)),
      ).toString()}`,
    ).then((r) => r.json())
  }

  public get_bookmarks_on_authorized_user(): Promise<LibrarySearchBookmarks_Dto.Response.Authorized> {
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

  public get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<LibrarySearchBookmarks_Dto.Response.Public> {
    return fetch(
      `${this._api_url}/v1/library-search/bookmarks/${params.username}`,
    ).then((r) => r.json())
  }
}
