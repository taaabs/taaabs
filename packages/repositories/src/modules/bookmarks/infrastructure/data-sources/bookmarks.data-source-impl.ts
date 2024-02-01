import CryptoJS from 'crypto-js'
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
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'

export class Bookmarks_DataSourceImpl implements Bookmarks_DataSource {
  constructor(
    private readonly _api_url: string,
    private readonly _auth_token: string,
  ) {}

  public async get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<Bookmarks_Dto.Response.Authorized> {
    const query_params: Bookmarks_Dto.QueryParams = {
      tags: params.tags?.join(','),
      after: params.after,
      starred_only: params.starred_only,
      unread_only: params.unread_only,
      is_archived: params.is_archived,
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
      `${this._api_url}/v1/bookmarks?${new URLSearchParams(
        JSON.parse(JSON.stringify(query_params)),
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
    const query_params: Bookmarks_Dto.QueryParams = {
      tags: params.tags?.join(','),
      after: params.after,
      starred_only: params.starred_only,
      is_archived: params.is_archived,
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
  ): Promise<BookmarksByIds_Dto.Response.Public> {
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

  public async record_visit(params: RecordVisit_Params): Promise<void> {
    const body: RecordVisit_Dto.Body = {
      bookmark_id: params.bookmark_id,
      visited_at: params.visited_at.toISOString(),
    }
    await fetch(`${this._api_url}/v1/bookmarks/record-visit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._auth_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
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
      title: params.is_public ? params.title : undefined,
      title_aes:
        !params.is_public && params.title
          ? CryptoJS.AES.encrypt(params.title, 'my_secret_key').toString()
          : undefined,
      note: params.is_public ? params.note : undefined,
      note_aes:
        !params.is_public && params.note
          ? CryptoJS.AES.encrypt(params.note, 'my_secret_key').toString()
          : undefined,
      is_public: params.is_public,
      is_archived: params.is_archived || undefined,
      stars: params.stars || undefined,
      is_unread: params.is_unread || undefined,
      tags: params.tags
        .filter((tag) => tag.name.trim().length > 0)
        .reduce(
          (acc, tag) => {
            const is_duplicate = acc.findIndex((t) => t.name == tag.name) != -1
            if (is_duplicate) {
              return acc
            } else {
              return [...acc, tag]
            }
          },
          [] as UpsertBookmark_Params['tags'],
        )
        .map((tag) => ({
          name: tag.is_public ? tag.name.trim() : undefined,
          name_aes: !tag.is_public
            ? CryptoJS.AES.encrypt(tag.name.trim(), 'my_secret_key').toString()
            : undefined,
          hash: CryptoJS.SHA256(tag.name + 'my_secret_key').toString(),
          is_public: tag.is_public,
        })),
      links: params.links
        .filter((link) => link.url.trim().length > 0)
        .reduce(
          (acc, link) => {
            const is_duplicate =
              acc.findIndex((l) => l.url == link.url.trim()) != -1
            if (is_duplicate) {
              return acc
            } else {
              return [...acc, link]
            }
          },
          [] as UpsertBookmark_Params['links'],
        )
        .map((link) => {
          const domain = get_domain_from_url(link.url)
          return {
            url: link.is_public ? link.url.trim() : undefined,
            url_aes: !link.is_public
              ? CryptoJS.AES.encrypt(
                  link.url.trim(),
                  'my_secret_key',
                ).toString()
              : undefined,
            site_aes: !link.is_public
              ? CryptoJS.AES.encrypt(
                  link.site_path ? `${domain}/${link.site_path}` : domain,
                  'my_secret_key',
                ).toString()
              : undefined,
            hash: CryptoJS.SHA256(link.url.trim() + 'my_secret_key').toString(),
            site: link.is_public ? link.site_path : undefined,
            is_public: link.is_public,
          }
        }),
    }

    if (params.bookmark_id) {
      return fetch(`${this._api_url}/v1/bookmarks/${params.bookmark_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${this._auth_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookmark),
      }).then((r) => {
        if (r.ok) {
          return r.json()
        } else {
          throw new Error()
        }
      })
    } else {
      return fetch(`${this._api_url}/v1/bookmarks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this._auth_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookmark),
      }).then((r) => {
        if (r.ok) {
          return r.json()
        } else {
          throw new Error()
        }
      })
    }
  }
}
