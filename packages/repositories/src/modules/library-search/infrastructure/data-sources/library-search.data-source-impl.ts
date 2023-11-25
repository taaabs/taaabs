import { LibrarySearchBookmarks_Dto } from '@shared/types/modules/library-search/library-search-bookmarks.dto'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { LibrarySearch_DataSource } from './library-search.data-source'

export class LibrarySearch_DataSourceImpl implements LibrarySearch_DataSource {
  constructor(
    private readonly _api_url: string,
    private readonly _auth_token: string,
  ) {}

  public get_bookmarks_on_authorized_user(): Promise<LibrarySearchBookmarks_Dto.Response.Authorized> {
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
