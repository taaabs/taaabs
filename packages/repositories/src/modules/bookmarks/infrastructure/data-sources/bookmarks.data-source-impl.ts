import { Bookmarks_DataSource } from './bookmarks.data-source'
import { Bookmarks_Dto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { RecordVisit_Params } from '../../domain/types/record-visit.params'
import { DeleteBookmark_Params } from '../../domain/types/delete-bookmark.params'
import { UpsertBookmark_Params } from '../../domain/types/upsert-bookmark.params'
import { CreateBookmark_Dto } from '@shared/types/modules/bookmarks/create-bookmark.dto'
import { BookmarksByIds_Dto } from '@shared/types/modules/bookmarks/bookmarks-by-ids.dto'
import { GetBookmarksByIds_Params } from '../../domain/types/get-bookmarks-by-ids.params'
import { RecordVisit_Dto } from '@shared/types/modules/bookmarks/record-visit.dto'
import { Bookmark_Entity } from '../../domain/entities/bookmark.entity'

export class Bookmarks_DataSourceImpl implements Bookmarks_DataSource {
  constructor(
    private readonly _api_url: string,
    private readonly _auth_token: string,
  ) {}

  public async get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<Bookmarks_Dto.Response.Authorized> {
    const queryParams: Bookmarks_Dto.QueryParams.Authorized = {
      tags: params.tags?.join(','),
      category_id: params.category_id,
      after: params.after,
      filter: params.filter,
      sort_by: params.sort_by,
      order: params.order,
      epoch_gte: params.yyyymm_gte
        ? new Date(
            parseInt(params.yyyymm_gte.toString().substring(0, 4)),
            parseInt(params.yyyymm_gte.toString().substring(4, 6)) - 1,
          ).getTime() / 1000
        : undefined,
      epoch_lte: params.yyyymm_lte
        ? new Date(
            parseInt(params.yyyymm_lte.toString().substring(0, 4)),
            parseInt(params.yyyymm_lte.toString().substring(4, 6)),
          ).getTime() / 1000
        : undefined,
      public_only: params.public_only,
    }

    return fetch(
      `${this._api_url}/v1/bookmarks?${new URLSearchParams(
        JSON.parse(JSON.stringify(queryParams)),
      ).toString()}`,
      {
        headers: {
          Authorization: `Bearer ${this._auth_token}`,
        },
      },
    ).then((r) => r.json())
  }

  public async get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<Bookmarks_Dto.Response.Public> {
    const query_params: Bookmarks_Dto.QueryParams.Public = {
      tags: params.tags?.join(','),
      category_id: params.category_id,
      after: params.after,
      filter: params.filter,
      sort_by: params.sort_by,
      order: params.order,
      epoch_gte: params.yyyymm_gte
        ? new Date(
            parseInt(params.yyyymm_gte.toString().substring(0, 4)),
            parseInt(params.yyyymm_gte.toString().substring(4, 6)) - 1,
          ).getTime() / 1000
        : undefined,
      epoch_lte: params.yyyymm_lte
        ? new Date(
            parseInt(params.yyyymm_lte.toString().substring(0, 4)),
            parseInt(params.yyyymm_lte.toString().substring(4, 6)),
          ).getTime() / 1000
        : undefined,
    }

    return fetch(
      `${this._api_url}/v1/bookmarks/${params.username}?${new URLSearchParams(
        JSON.parse(JSON.stringify(query_params)),
      ).toString()}`,
    ).then((r) => r.json())
  }

  public async get_bookmarks_by_ids_authorized(
    params: GetBookmarksByIds_Params.Authorized,
  ): Promise<BookmarksByIds_Dto.Response.Authorized> {
    const body: BookmarksByIds_Dto.Body = {
      ids: params.ids,
    }
    return await fetch(`${this._api_url}/v1/bookmarks/by-ids`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._auth_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((r) => r.json())
  }

  public async get_bookmarks_by_ids_public(
    params: GetBookmarksByIds_Params.Public,
  ): Promise<BookmarksByIds_Dto.Response.Authorized> {
    const body: BookmarksByIds_Dto.Body = {
      ids: params.ids,
    }
    return await fetch(
      `${this._api_url}/v1/bookmarks/by-ids/${params.username}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this._auth_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    ).then((r) => r.json())
  }

  public async record_visit(
    params: RecordVisit_Params,
  ): Promise<RecordVisit_Dto.Response> {
    return await fetch(
      `${this._api_url}/v1/bookmarks/${params.bookmark_id}/record-visit`,
      {
        headers: {
          Authorization: `Bearer ${this._auth_token}`,
        },
      },
    ).then((r) => r.json())
  }

  public async delete_bookmark(params: DeleteBookmark_Params): Promise<void> {
    await fetch(`${this._api_url}/v1/bookmarks/${params.bookmark_id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this._auth_token}`,
      },
    })
  }

  public async upsert_bookmark(
    params: UpsertBookmark_Params,
  ): Promise<Bookmarks_Dto.Response.AuthorizedBookmark> {
    const bookmark: CreateBookmark_Dto = {
      created_at: params.created_at?.toISOString(),
      title: params.title,
      is_public: params.is_public || undefined,
      is_archived: params.is_archived || undefined,
      stars: params.stars || undefined,
      is_unread: params.is_unread || undefined,
      tags: params.tags.map((tag) => ({
        name: tag.name,
        is_public: tag.is_public || undefined,
      })),
      links: params.links.map((link) => ({
        url: link.url,
        site_path: link.site_path,
        is_public: link.is_public || undefined,
      })),
    }

    if (params.bookmark_id) {
      return await fetch(
        `${this._api_url}/v1/bookmarks/${params.bookmark_id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this._auth_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookmark),
        },
      ).then((r) => r.json())
    } else {
      return await fetch(`${this._api_url}/v1/bookmarks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this._auth_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookmark),
      }).then((r) => r.json())
    }
  }
}
