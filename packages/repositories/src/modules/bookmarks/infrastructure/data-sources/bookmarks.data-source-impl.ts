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
import { Crypto } from '@repositories/utils/crypto'
import { KyInstance } from 'ky'

export class Bookmarks_DataSourceImpl implements Bookmarks_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<Bookmarks_Dto.Response.Authorized> {
    const search_params: Bookmarks_Dto.SearchParams = {
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

    return this._ky
      .get(`v1/bookmarks`, {
        searchParams: JSON.parse(JSON.stringify(search_params)),
      })
      .json()
  }

  public async get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<Bookmarks_Dto.Response.Public> {
    const search_params: Bookmarks_Dto.SearchParams = {
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

    return this._ky
      .get(`v1/bookmarks/${params.username}`, {
        searchParams: JSON.parse(JSON.stringify(search_params)),
      })
      .json()
  }

  public async get_bookmarks_by_ids_authorized(
    params: GetBookmarksByIds_Params.Authorized,
  ): Promise<BookmarksByIds_Dto.Response.Authorized> {
    const body: BookmarksByIds_Dto.Body = params.ids
    return this._ky
      .post('v1/bookmarks/by-ids', {
        body: JSON.stringify(body),
      })
      .json()
  }

  public async get_bookmarks_by_ids_public(
    params: GetBookmarksByIds_Params.Public,
  ): Promise<BookmarksByIds_Dto.Response.Public> {
    const body: BookmarksByIds_Dto.Body = params.ids
    return this._ky
      .post(`v1/bookmarks/by-ids/${params.username}`, {
        body: JSON.stringify(body),
      })
      .json()
  }

  public async record_visit(params: RecordVisit_Params): Promise<void> {
    const body: RecordVisit_Dto.Body = {
      bookmark_id: params.bookmark_id,
      visited_at: params.visited_at,
    }
    await this._ky.post(`v1/bookmarks/record-visit`, {
      body: JSON.stringify(body),
    })
  }

  public async delete_bookmark(params: DeleteBookmark_Params): Promise<void> {
    await this._ky.delete(`v1/bookmarks/${params.bookmark_id}`)
  }

  public async upsert_bookmark(
    params: UpsertBookmark_Params,
  ): Promise<Bookmarks_Dto.Response.AuthorizedBookmark> {
    const key = await Crypto.derive_key_from_password('my_secret_key')

    const body: CreateBookmark_Dto.Body = {
      created_at: params.created_at_?.toISOString(),
      title: params.is_public_ ? params.title_ : undefined,
      title_aes:
        !params.is_public_ && params.title_
          ? await Crypto.AES.encrypt(params.title_, key)
          : undefined,
      note: params.is_public_ ? params.note_ : undefined,
      note_aes:
        !params.is_public_ && params.note_
          ? await Crypto.AES.encrypt(params.note_, key)
          : undefined,
      is_public: params.is_public_ || undefined,
      is_archived: params.is_archived_ || undefined,
      stars: params.stars_ || undefined,
      is_unread: params.is_unread_ || undefined,
      tags: await Promise.all(
        params.tags_
          .filter((tag) => tag.name_.trim().length > 0)
          .reduce(
            (acc, tag) => {
              const is_duplicate =
                acc.findIndex((t) => t.name_ == tag.name_) != -1
              if (is_duplicate) {
                return acc
              } else {
                return [...acc, tag]
              }
            },
            [] as UpsertBookmark_Params['tags_'],
          )
          .map(async (tag) => {
            if (tag.is_public_) {
              return {
                is_public: true,
                hash: await Crypto.SHA256(tag.name_, key),
                name: tag.name_.trim(),
              }
            } else {
              return {
                is_public: false,
                hash: await Crypto.SHA256(tag.name_, key),
                name_aes: await Crypto.AES.encrypt(tag.name_.trim(), key),
              }
            }
          }),
      ),
      links: await Promise.all(
        params.links_
          .filter((link) => link.url_.trim().length > 0)
          .reduce(
            (acc, link) => {
              const is_duplicate =
                acc.findIndex((l) => l.url_ == link.url_.trim()) != -1
              if (is_duplicate) {
                return acc
              } else {
                return [...acc, link]
              }
            },
            [] as UpsertBookmark_Params['links_'],
          )
          .map(async (link) => {
            const domain = get_domain_from_url(link.url_)
            if (link.is_public_) {
              return {
                is_public: true,
                url: link.url_.trim(),
                hash: await Crypto.SHA256(link.url_.trim(), key),
                site_path: link.is_public_ ? link.site_path_ : undefined,
                is_pinned: link.is_pinned_,
                pin_title: link.pin_title_,
                via_wayback: link.via_wayback_,
              }
            } else {
              return {
                is_public: false,
                url_aes: await Crypto.AES.encrypt(link.url_.trim(), key),
                site_aes: await Crypto.AES.encrypt(
                  link.site_path_ ? `${domain}/${link.site_path_}` : domain,
                  key,
                ),
                hash: await Crypto.SHA256(link.url_.trim(), key),
                is_pinned: link.is_pinned_,
                pin_title_aes: link.pin_title_
                  ? await Crypto.AES.encrypt(link.pin_title_, key)
                  : undefined,
                via_wayback: link.via_wayback_,
              }
            }
          }),
      ),
    }

    if (params.bookmark_id_) {
      return this._ky
        .put(`v1/bookmarks/${params.bookmark_id_}`, {
          body: JSON.stringify(body),
        })
        .json()
    } else {
      return this._ky
        .post('v1/bookmarks', {
          body: JSON.stringify(body),
        })
        .json()
    }
  }
}
