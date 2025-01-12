import { Bookmarks_Repository } from '../../domain/repositories/bookmarks.repository'
import { Bookmarks_DataSource } from '../data-sources/bookmarks.data-source'
import { GetBookmarks_Ro } from '../../domain/types/get-bookmarks.ro'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { RecordVisit_Params } from '../../domain/types/record-visit.params'
import { DeleteBookmark_Params } from '../../domain/types/delete-bookmark.params'
import { UpsertBookmark_Params } from '../../domain/types/upsert-bookmark.params'
import { GetBookmarksByIds_Ro } from '../../domain/types/get-bookmarks-by-ids.ro'
import { GetBookmarksByIds_Params } from '../../domain/types/get-bookmarks-by-ids.params'
import { Bookmark_Entity } from '../../domain/entities/bookmark.entity'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { AES } from '@repositories/utils/aes'
import { GetCover_Params } from '../../domain/types/get-cover.params'
import { FindByUrlHash_Ro } from '../../domain/types/find-by-url-hash.ro'
import { FindByUrlHash_Params } from '../../domain/types/find-by-url-hash.params'
import { Bookmarks_Dto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { DeleteBookmarkByUrlHash_Params } from '../../domain/types/delete-bookmark-by-url-hash.params'

export class Bookmarks_RepositoryImpl implements Bookmarks_Repository {
  constructor(private readonly _bookmarks_data_source: Bookmarks_DataSource) {}

  private async _dto_to_bookmark_entity(
    bookmark: Bookmarks_Dto.Response.AuthorizedBookmark,
    encryption_key: Uint8Array,
  ): Promise<Bookmark_Entity> {
    const tags: Bookmark_Entity['tags'] = []
    for (const tag of bookmark.tags) {
      tags.push({
        id: tag.id,
        name: tag.name
          ? tag.name
          : await AES.decrypt(tag.name_aes!, encryption_key),
        is_public: tag.is_public,
      })
    }

    const links: Bookmark_Entity['links'] = []
    for (const link of bookmark.links) {
      let site_path: string | undefined
      if (link.is_public) {
        site_path = link.site_path
      } else {
        const site = await AES.decrypt(link.site_aes!, encryption_key)
        const domain = `${get_domain_from_url(site)}/`
        site_path = site.slice(domain.length)
      }
      links.push({
        url: link.is_public
          ? link.url!
          : await AES.decrypt(link.url_aes!, encryption_key),
        site_path,
        is_public: link.is_public || false,
        saves: link.saves,
        is_pinned: link.is_pinned,
        pin_title: link.pin_title
          ? link.pin_title
          : link.pin_title_aes
          ? await AES.decrypt(link.pin_title_aes!, encryption_key)
          : undefined,
        open_snapshot: link.open_snapshot,
      })
    }

    return {
      id: bookmark.id,
      is_public: bookmark.is_public || false,
      is_archived: bookmark.is_archived,
      created_at: bookmark.created_at,
      updated_at: bookmark.updated_at,
      visited_at: bookmark.visited_at,
      title: bookmark.title
        ? bookmark.title
        : bookmark.title_aes
        ? await AES.decrypt(bookmark.title_aes, encryption_key)
        : undefined,
      note: bookmark.note
        ? bookmark.note
        : bookmark.note_aes
        ? await AES.decrypt(bookmark.note_aes, encryption_key)
        : undefined,
      is_unsorted: bookmark.is_unsorted,
      is_compact: true,
      stars: bookmark.stars || 0,
      points: bookmark.points,
      views: bookmark.views,
      tags,
      links,
    }
  }

  public async get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
    encryption_key: Uint8Array,
  ): Promise<GetBookmarks_Ro> {
    const result =
      await this._bookmarks_data_source.get_bookmarks_on_authorized_user(params)

    const bookmarks: Bookmark_Entity[] = []

    for (const bookmark of result.bookmarks || []) {
      bookmarks.push(
        await this._dto_to_bookmark_entity(bookmark, encryption_key),
      )
    }

    return {
      bookmarks: bookmarks.length ? bookmarks : undefined,
      pagination: result.pagination
        ? {
            has_more: result.pagination.has_more,
          }
        : undefined,
      processing_progress: result.processing_progress,
      import_progress: result.import_progress,
    }
  }

  public async get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<GetBookmarks_Ro> {
    const result =
      await this._bookmarks_data_source.get_bookmarks_on_public_user(params)

    const bookmarks: Bookmark_Entity[] = []

    if (result.bookmarks) {
      for (const bookmark of result.bookmarks) {
        const tags: Bookmark_Entity['tags'] = []
        for (const tag of bookmark.tags) {
          tags.push({
            id: tag.id,
            name: tag.name,
            is_public: true,
          })
        }

        const links: Bookmark_Entity['links'] = []
        for (const link of bookmark.links) {
          links.push({
            url: link.url,
            saves: link.saves,
            site_path: link.site_path,
            is_public: true,
            is_pinned: link.is_pinned,
            open_snapshot: link.open_snapshot,
          })
        }

        bookmarks.push({
          id: bookmark.id,
          is_public: true,
          created_at: bookmark.created_at,
          updated_at: bookmark.updated_at,
          visited_at: bookmark.visited_at,
          title: bookmark.title,
          note: bookmark.note,
          is_unsorted: bookmark.is_unsorted,
          stars: bookmark.stars || 0,
          points: bookmark.points,
          tags,
          links,
        })
      }
    }

    return {
      bookmarks: bookmarks.length ? bookmarks : undefined,
      pagination: result.pagination
        ? {
            has_more: result.pagination.has_more,
          }
        : undefined,
      processing_progress: result.processing_progress,
    }
  }

  public async get_bookmarks_by_ids_authorized(
    params: GetBookmarksByIds_Params.Authorized,
    encryption_key: Uint8Array,
  ): Promise<GetBookmarksByIds_Ro> {
    const result =
      await this._bookmarks_data_source.get_bookmarks_by_ids_authorized(params)

    const bookmarks: Bookmark_Entity[] = []

    for (const bookmark of result.bookmarks || []) {
      bookmarks.push(
        await this._dto_to_bookmark_entity(bookmark, encryption_key),
      )
    }

    return {
      bookmarks: bookmarks.length ? bookmarks : undefined,
    }
  }

  public async get_bookmarks_by_ids_public(
    params: GetBookmarksByIds_Params.Public,
  ): Promise<GetBookmarksByIds_Ro> {
    const result =
      await this._bookmarks_data_source.get_bookmarks_by_ids_public(params)

    return {
      bookmarks: result.bookmarks
        ? result.bookmarks.map((bookmark) => ({
            id: bookmark.id,
            created_at: bookmark.created_at,
            updated_at: bookmark.updated_at,
            visited_at: bookmark.visited_at,
            title: bookmark.title,
            note: bookmark.note,
            is_public: true,
            is_unsorted: bookmark.is_unsorted,
            stars: bookmark.stars || 0,
            points: bookmark.points,
            tags: bookmark.tags.map((tag) => ({
              id: tag.id,
              name: tag.name,
              is_public: true,
            })),
            links: bookmark.links.map((link) => ({
              url: link.url,
              saves: link.saves,
              site_path: link.site_path,
              is_public: true,
              open_snapshot: link.open_snapshot,
            })),
          }))
        : undefined,
    }
  }

  public async upsert_bookmark(
    params: UpsertBookmark_Params,
    encryption_key: Uint8Array,
  ): Promise<Bookmark_Entity> {
    const bookmark = await this._bookmarks_data_source.upsert_bookmark(
      params,
      encryption_key,
    )

    return {
      id: bookmark.id,
      is_public: bookmark.is_public || false,
      created_at: bookmark.created_at,
      updated_at: bookmark.updated_at,
      visited_at: bookmark.visited_at,
      title: bookmark.title
        ? bookmark.title
        : bookmark.title_aes
        ? await AES.decrypt(bookmark.title_aes, encryption_key)
        : undefined,
      note: bookmark.note
        ? bookmark.note
        : bookmark.note_aes
        ? await AES.decrypt(bookmark.note_aes, encryption_key)
        : undefined,
      is_unsorted: bookmark.is_unsorted,
      stars: bookmark.stars || 0,
      points: bookmark.points,
      tags: await Promise.all(
        bookmark.tags.map(async (tag) => ({
          id: tag.id,
          name: tag.name
            ? tag.name
            : await AES.decrypt(tag.name_aes!, encryption_key),
          is_public: tag.is_public || false,
        })),
      ),
      links: await Promise.all(
        bookmark.links.map(async (link) => {
          let site_path: string | undefined
          if (link.is_public) {
            site_path = link.site_path
          } else {
            const site = await AES.decrypt(link.site_aes!, encryption_key)
            const domain = `${get_domain_from_url(site)}/`
            site_path = site.slice(domain.length)
          }
          return {
            url: link.is_public
              ? link.url!
              : await AES.decrypt(link.url_aes!, encryption_key),
            site_path,
            saves: link.saves,
            is_public: link.is_public || false,
            is_pinned: link.is_pinned,
            pin_title: link.pin_title
              ? link.pin_title
              : link.pin_title_aes
              ? await AES.decrypt(link.pin_title_aes, encryption_key)
              : undefined,
            open_snapshot: link.open_snapshot,
          }
        }),
      ),
    }
  }

  public async delete_bookmark(params: DeleteBookmark_Params): Promise<void> {
    await this._bookmarks_data_source.delete_bookmark(params)
  }

  public async get_cover(
    params: GetCover_Params,
    encryption_key: Uint8Array,
  ): Promise<string> {
    const cover_aes = await this._bookmarks_data_source.get_cover(params)
    return await AES.decrypt(cover_aes, encryption_key)
  }

  public async record_visit(params: RecordVisit_Params): Promise<void> {
    await this._bookmarks_data_source.record_visit(params)
  }

  public async find_by_url_hash(
    params: FindByUrlHash_Params,
    encryption_key: Uint8Array,
  ): Promise<FindByUrlHash_Ro> {
    const bookmark = await this._bookmarks_data_source.find_by_url_hash(
      params,
      encryption_key,
    )

    return this._dto_to_bookmark_entity(bookmark, encryption_key)
  }

  public async delete_bookmark_by_url_hash(
    params: DeleteBookmarkByUrlHash_Params,
    encryption_key: Uint8Array,
  ): Promise<void> {
    await this._bookmarks_data_source.delete_bookmark_by_url_hash(
      params,
      encryption_key,
    )
  }
}
