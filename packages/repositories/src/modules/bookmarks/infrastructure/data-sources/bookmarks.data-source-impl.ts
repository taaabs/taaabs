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
import { AES } from '@repositories/utils/aes'
import { SHA256 } from '@repositories/utils/sha256'
import { KyInstance } from 'ky'
import { GetCover_Params } from '../../domain/types/get-cover.params'
import { FindByUrlHash_Dto } from '@shared/types/modules/bookmarks/find-by-url-hash.dto'
import { FindByUrlHash_Params } from '../../domain/types/find-by-url-hash.params'
import { DeleteBookmarkByUrlHash_Params } from '../../domain/types/delete-bookmark-by-url-hash.params'
import { system_values } from '@shared/constants/system-values'

export class Bookmarks_DataSourceImpl implements Bookmarks_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<Bookmarks_Dto.Response.Authorized> {
    const search_params: Bookmarks_Dto.SearchParams = {
      tags: params.tags?.join(','),
      after: params.after,
      starred_only: params.starred_only,
      unsorted_only: params.unsorted_only,
      is_archived: params.is_archived,
      sort_by: params.sort_by,
      order: params.order,
      gte: params.yyyymm_gte,
      lte: params.yyyymm_lte,
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
      gte: params.yyyymm_gte,
      lte: params.yyyymm_lte,
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
        json: body,
      })
      .json()
  }

  public async get_bookmarks_by_ids_public(
    params: GetBookmarksByIds_Params.Public,
  ): Promise<BookmarksByIds_Dto.Response.Public> {
    const body: BookmarksByIds_Dto.Body = params.ids
    return this._ky
      .post(`v1/bookmarks/by-ids/${params.username}`, {
        json: body,
      })
      .json()
  }

  public async upsert_bookmark(
    params: UpsertBookmark_Params,
    encryption_key: Uint8Array,
  ): Promise<Bookmarks_Dto.Response.AuthorizedBookmark> {
    const tags: CreateBookmark_Dto.Body['tags'] = []
    if (params.tags) {
      for (const tag of params.tags) {
        if (!tag.name.trim().length) continue
        const hash = await SHA256(tag.name, encryption_key)
        if (tags.find((t) => t.hash == hash)) continue
        if (tag.is_public) {
          tags.push({
            is_public: true,
            hash,
            name: tag.name.trim(),
          })
        } else {
          tags.push({
            is_public: false,
            hash,
            name_aes: await AES.encrypt(tag.name.trim(), encryption_key),
          })
        }
      }
    }

    const links: CreateBookmark_Dto.Body['links'] = []
    if (params.links) {
      for (const link of params.links) {
        if (!link.url.trim().length) continue
        const hash = await SHA256(link.url.trim(), encryption_key)
        if (links.find((l) => l.hash == hash)) continue
        const domain = get_domain_from_url(link.url)
        if (link.is_public) {
          links.push({
            is_public: true,
            url: link.url.trim(),
            hash: await SHA256(link.url.trim(), encryption_key),
            site_path: link.is_public ? link.site_path : undefined,
            is_pinned: link.is_pinned,
            pin_title: link.pin_title,
            open_snapshot: link.open_snapshot,
          })
        } else {
          links.push({
            is_public: false,
            url_aes: await AES.encrypt(link.url.trim(), encryption_key),
            site_aes: await AES.encrypt(
              link.site_path ? `${domain}/${link.site_path}` : domain,
              encryption_key,
            ),
            hash: await SHA256(link.url.trim(), encryption_key),
            is_pinned: link.is_pinned,
            pin_title_aes: link.pin_title
              ? await AES.encrypt(link.pin_title, encryption_key)
              : undefined,
            open_snapshot: link.open_snapshot,
          })
        }
      }
    }

    const title =
      params.title == ''
        ? null
        : params.title?.substring(0, system_values.bookmark.title.max_length)

    const note =
      params.note == ''
        ? null
        : params.note?.substring(0, system_values.bookmark.note.max_length)

    const body: CreateBookmark_Dto.Body = {
      created_at: params.created_at?.toISOString(),
      title: params.is_public ? title : undefined,
      title_aes:
        !params.is_public && title
          ? await AES.encrypt(title, encryption_key)
          : title,
      note: params.is_public ? note : undefined,
      note_aes:
        !params.is_public && note
          ? await AES.encrypt(note, encryption_key)
          : note,
      is_public: params.is_public,
      is_archived: params.is_archived,
      stars: params.stars,
      is_unsorted:
        params.is_unsorted === undefined
          ? params.tags && params.tags.length
            ? false
            : undefined
          : params.is_unsorted,
      tags: params.tags ? tags : undefined,
      links: links.length ? links : undefined,
    }

    if (params.bookmark_id) {
      return this._ky
        .patch(`v1/bookmarks/${params.bookmark_id}`, {
          json: body,
        })
        .json()
    } else {
      return this._ky
        .post('v1/bookmarks', {
          json: body,
        })
        .json()
    }
  }

  public async delete_bookmark(params: DeleteBookmark_Params): Promise<void> {
    await this._ky.delete(`v1/bookmarks/${params.bookmark_id}`)
  }

  public async get_cover(params: GetCover_Params): Promise<string> {
    const search_params = new URLSearchParams()
    search_params.set(
      'v',
      `${Math.floor(new Date(params.bookmark_updated_at).getTime() / 1000)}`,
    )
    return await this._ky
      .get(`v1/bookmarks/${params.bookmark_id}/cover`, {
        searchParams: search_params,
      })
      .text()
  }

  public async record_visit(params: RecordVisit_Params): Promise<void> {
    const body: RecordVisit_Dto.Body = {
      bookmark_id: params.bookmark_id,
      visited_at: params.visited_at,
    }
    await this._ky.post(`v1/bookmarks/record-visit`, {
      json: body,
    })
  }

  public async find_by_url_hash(
    params: FindByUrlHash_Params,
    encryption_key: Uint8Array,
  ): Promise<FindByUrlHash_Dto.Response> {
    const hash = await SHA256(params.url, encryption_key)
    return this._ky.get(`v1/bookmarks/find-by-url-hash/${hash}`).json()
  }

  public async delete_bookmark_by_url_hash(
    params: DeleteBookmarkByUrlHash_Params,
    encryption_key: Uint8Array,
  ): Promise<void> {
    const hash = await SHA256(params.hash, encryption_key)
    await this._ky.delete(`v1/bookmarks/delete-by-url-hash/${hash}`)
  }
}
