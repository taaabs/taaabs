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
import { GetLinksData_Params } from '../../domain/types/get-links-data.params'
import { LinksData_Dto } from '@shared/types/modules/bookmarks/links-data.dto'
import pako from 'pako'
import { GetCover_Params } from '../../domain/types/get-cover.params'

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

  public async get_links_data_authorized(
    params: GetLinksData_Params.Authorized,
  ): Promise<LinksData_Dto.Response.Authorized> {
    const search_params = new URLSearchParams()
    if (params.bookmark_updated_at) {
      search_params.set(
        'v',
        `${Math.floor(new Date(params.bookmark_updated_at).getTime() / 1000)}`,
      )
    }
    return await this._ky
      .get(`v1/bookmarks/${params.bookmark_id}/links-data`, {
        searchParams: search_params,
      })
      .json()
  }

  public async get_links_data_public(
    params: GetLinksData_Params.Public,
  ): Promise<LinksData_Dto.Response.Public> {
    const search_params = new URLSearchParams()
    if (params.bookmark_updated_at) {
      search_params.set(
        'v',
        `${Math.floor(new Date(params.bookmark_updated_at).getTime() / 1000)}`,
      )
    }
    return await this._ky
      .get(`v1/bookmarks/${params.username}/${params.bookmark_id}/links-data`, {
        searchParams: search_params,
      })
      .json()
  }

  public async upsert_bookmark(
    params: UpsertBookmark_Params,
    encryption_key: Uint8Array,
  ): Promise<Bookmarks_Dto.Response.AuthorizedBookmark> {
    const tags: CreateBookmark_Dto.Body['tags'] = []
    for (const tag of params.tags) {
      if (!tag.name.trim().length) continue
      const hash = await Crypto.SHA256(tag.name, encryption_key)
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
          name_aes: await Crypto.AES.encrypt(tag.name.trim(), encryption_key),
        })
      }
    }

    const links: CreateBookmark_Dto.Body['links'] = []
    for (const link of params.links) {
      if (!link.url.trim().length) continue
      const hash = await Crypto.SHA256(link.url.trim(), encryption_key)
      if (links.find((l) => l.hash == hash)) continue
      const domain = get_domain_from_url(link.url)
      if (link.is_public) {
        links.push({
          is_public: true,
          url: link.url.trim(),
          hash: await Crypto.SHA256(link.url.trim(), encryption_key),
          site_path: link.is_public ? link.site_path : undefined,
          is_pinned: link.is_pinned,
          pin_title: link.pin_title,
          open_snapshot: link.open_snapshot,
          reader_data: link.reader_data,
          favicon_aes: link.favicon
            ? await Crypto.AES.encrypt(link.favicon, encryption_key)
            : undefined,
        })
      } else {
        links.push({
          is_public: false,
          url_aes: await Crypto.AES.encrypt(link.url.trim(), encryption_key),
          site_aes: await Crypto.AES.encrypt(
            link.site_path ? `${domain}/${link.site_path}` : domain,
            encryption_key,
          ),
          hash: await Crypto.SHA256(link.url.trim(), encryption_key),
          is_pinned: link.is_pinned,
          pin_title_aes: link.pin_title
            ? await Crypto.AES.encrypt(link.pin_title, encryption_key)
            : undefined,
          open_snapshot: link.open_snapshot,
          favicon_aes: link.favicon
            ? await Crypto.AES.encrypt(link.favicon, encryption_key)
            : undefined,
          reader_data_aes: link.reader_data
            ? await Crypto.AES.encrypt(
                btoa(String.fromCharCode(...pako.deflate(link.reader_data))),
                encryption_key,
              )
            : undefined,
        })
      }
    }

    let cover = params.cover

    if (!params.cover) {
      if (params.cover_hash) {
        try {
          const image_blob = await this._ky
            .get(`v1/covers/${params.cover_hash}`)
            .blob()

          cover = await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              if (reader.result && typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1])
              } else {
                reject(new Error('Failed to read image data'))
              }
            }
            reader.onerror = reject
            reader.readAsDataURL(image_blob)
          })
        } catch (error) {
          console.error('Error fetching image:', error)
          throw error
        }
      } else if (params.has_cover_aes) {
        const cover_encrypted = await this.get_cover({
          bookmark_id: params.bookmark_id!,
          bookmark_updated_at: '',
        })
        cover = await Crypto.AES.decrypt(cover_encrypted, encryption_key)
      }
    }

    const body: CreateBookmark_Dto.Body = {
      created_at: params.created_at?.toISOString(),
      title: params.is_public ? params.title : undefined,
      title_aes:
        !params.is_public && params.title
          ? await Crypto.AES.encrypt(params.title, encryption_key)
          : undefined,
      note: params.is_public ? params.note : undefined,
      note_aes:
        !params.is_public && params.note
          ? await Crypto.AES.encrypt(params.note, encryption_key)
          : undefined,
      is_public: params.is_public || undefined,
      is_archived: params.is_archived || undefined,
      stars: params.stars || undefined,
      is_unsorted:
        params.is_unsorted === undefined
          ? params.tags.length
            ? false
            : undefined
          : params.is_unsorted,
      tags,
      links,
      cover: params.is_public ? cover : undefined,
      cover_aes:
        !params.is_public && cover
          ? await Crypto.AES.encrypt(cover, encryption_key)
          : undefined,
      blurhash_aes:
        !params.is_public && params.blurhash
          ? await Crypto.AES.encrypt(params.blurhash, encryption_key)
          : undefined,
    }

    if (params.bookmark_id) {
      return this._ky
        .put(`v1/bookmarks/${params.bookmark_id}`, {
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
}
