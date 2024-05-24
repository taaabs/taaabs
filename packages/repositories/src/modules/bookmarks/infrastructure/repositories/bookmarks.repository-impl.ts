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
import { Crypto } from '@repositories/utils/crypto'
import { GetLinksDataForVisibilityChange_Params } from '../../domain/types/get-links-data-for-visibility-change.params'
import { GetLinksDataForVisibilityChange_Ro } from '../../domain/types/get-links-data-for-visibility-change.ro'

export class Bookmarks_RepositoryImpl implements Bookmarks_Repository {
  constructor(private readonly _bookmarks_data_source: Bookmarks_DataSource) {}

  public async get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
    encryption_key: Uint8Array,
  ): Promise<GetBookmarks_Ro> {
    const result =
      await this._bookmarks_data_source.get_bookmarks_on_authorized_user(params)

    return {
      bookmarks: result.bookmarks
        ? await Promise.all(
            result.bookmarks.map(async (bookmark) => ({
              id: bookmark.id,
              is_public: bookmark.is_public || false,
              created_at: bookmark.created_at,
              updated_at: bookmark.updated_at,
              visited_at: bookmark.visited_at,
              title: bookmark.title
                ? bookmark.title
                : bookmark.title_aes
                ? await Crypto.AES.decrypt(bookmark.title_aes, encryption_key)
                : undefined,
              note: bookmark.note
                ? bookmark.note
                : bookmark.note_aes
                ? await Crypto.AES.decrypt(bookmark.note_aes, encryption_key)
                : undefined,
              is_unread: bookmark.is_unread || false,
              stars: bookmark.stars || 0,
              points: bookmark.points,
              tags: await Promise.all(
                bookmark.tags.map(async (tag) => ({
                  id: tag.id,
                  name: tag.name
                    ? tag.name
                    : await Crypto.AES.decrypt(tag.name_aes!, encryption_key),
                  is_public: tag.is_public || undefined,
                })),
              ),
              links: await Promise.all(
                bookmark.links.map(async (link) => {
                  let site_path: string | undefined
                  if (link.is_public) {
                    site_path = link.site_path
                  } else {
                    const site = await Crypto.AES.decrypt(
                      link.site_aes!,
                      encryption_key,
                    )
                    const domain = `${get_domain_from_url(site)}/`
                    site_path = site.slice(domain.length)
                  }
                  return {
                    url: link.is_public
                      ? link.url!
                      : await Crypto.AES.decrypt(link.url_aes!, encryption_key),
                    site_path,
                    is_public: link.is_public || false,
                    saves: link.saves,
                    is_pinned: link.is_pinned,
                    pin_title: link.pin_title
                      ? link.pin_title
                      : link.pin_title_aes
                      ? await Crypto.AES.decrypt(
                          link.pin_title_aes!,
                          encryption_key,
                        )
                      : undefined,
                    open_snapshot: link.open_snapshot,
                    favicon: link.favicon_aes
                      ? await Crypto.AES.decrypt(
                          link.favicon_aes,
                          encryption_key,
                        )
                      : undefined,
                    has_plain_text: link.has_plain_text,
                    has_content: link.has_content,
                  }
                }),
              ),
              cover: bookmark.cover
                ? bookmark.cover
                : bookmark.cover_aes
                ? await Crypto.AES.decrypt(bookmark.cover_aes, encryption_key)
                : undefined,
            })),
          )
        : undefined,
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

    return {
      bookmarks: result.bookmarks
        ? result.bookmarks.map((bookmark) => ({
            id: bookmark.id,
            is_public: true,
            created_at: bookmark.created_at,
            updated_at: bookmark.updated_at,
            visited_at: bookmark.visited_at,
            title: bookmark.title,
            note: bookmark.note,
            is_unread: bookmark.is_unread || false,
            stars: bookmark.stars || 0,
            points: bookmark.points,
            tags: bookmark.tags.map((tag) => ({
              id: tag.id,
              name: tag.name,
            })),
            links: bookmark.links.map((link) => ({
              url: link.url,
              saves: link.saves,
              site_path: link.site_path,
              is_public: true,
              is_pinned: link.is_pinned,
              open_snapshot: link.open_snapshot,
              has_content: link.has_content,
            })),
            cover: bookmark.cover ? bookmark.cover : undefined,
          }))
        : undefined,
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
    const { bookmarks } =
      await this._bookmarks_data_source.get_bookmarks_by_ids_authorized(params)

    return {
      bookmarks: bookmarks
        ? await Promise.all(
            bookmarks.map(async (bookmark) => ({
              id: bookmark.id,
              is_public: bookmark.is_public || false,
              created_at: bookmark.created_at,
              updated_at: bookmark.updated_at,
              visited_at: bookmark.visited_at,
              title: bookmark.title
                ? bookmark.title
                : bookmark.title_aes
                ? await Crypto.AES.decrypt(bookmark.title_aes, encryption_key)
                : undefined,
              note: bookmark.note
                ? bookmark.note
                : bookmark.note_aes
                ? await Crypto.AES.decrypt(bookmark.note_aes, encryption_key)
                : undefined,
              is_unread: bookmark.is_unread || false,
              stars: bookmark.stars || 0,
              points: bookmark.points,
              tags: await Promise.all(
                bookmark.tags.map(async (tag) => ({
                  id: tag.id,
                  name: tag.name
                    ? tag.name
                    : await Crypto.AES.decrypt(tag.name_aes!, encryption_key),
                  is_public: tag.is_public || false,
                })),
              ),
              links: await Promise.all(
                bookmark.links.map(async (link) => {
                  let site_path: string | undefined
                  if (link.is_public) {
                    site_path = link.site_path
                  } else {
                    const site = await Crypto.AES.decrypt(
                      link.site_aes!,
                      encryption_key,
                    )
                    const domain = `${get_domain_from_url(site)}/`
                    site_path = site.slice(domain.length)
                  }
                  return {
                    url: link.is_public
                      ? link.url!
                      : await Crypto.AES.decrypt(link.url_aes!, encryption_key),
                    site_path,
                    is_public: link.is_public || false,
                    saves: link.saves,
                    is_pinned: link.is_pinned,
                    pin_title: link.pin_title
                      ? link.pin_title
                      : link.pin_title_aes
                      ? await Crypto.AES.decrypt(
                          link.pin_title_aes!,
                          encryption_key,
                        )
                      : undefined,
                    open_snapshot: link.open_snapshot,
                    favicon: link.favicon_aes
                      ? await Crypto.AES.decrypt(
                          link.favicon_aes,
                          encryption_key,
                        )
                      : undefined,
                    has_plain_text: link.has_plain_text,
                    has_content: link.has_content,
                  }
                }),
              ),
              cover: bookmark.cover
                ? bookmark.cover
                : bookmark.cover_aes
                ? await Crypto.AES.decrypt(bookmark.cover_aes, encryption_key)
                : undefined,
            })),
          )
        : undefined,
    }
  }

  public async get_bookmarks_by_ids_public(
    params: GetBookmarksByIds_Params.Public,
  ): Promise<GetBookmarksByIds_Ro> {
    const { bookmarks } =
      await this._bookmarks_data_source.get_bookmarks_by_ids_public(params)

    return {
      bookmarks: bookmarks
        ? bookmarks.map((bookmark) => ({
            id: bookmark.id,
            created_at: bookmark.created_at,
            updated_at: bookmark.updated_at,
            visited_at: bookmark.visited_at,
            title: bookmark.title,
            note: bookmark.note,
            is_public: true,
            is_unread: bookmark.is_unread || false,
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
              has_plain_text: link.has_plain_text,
            })),
            cover: bookmark.cover ? bookmark.cover : undefined,
          }))
        : undefined,
    }
  }

  public async get_links_data_for_visibility_change(
    params: GetLinksDataForVisibilityChange_Params,
    encryption_key: Uint8Array,
  ): Promise<GetLinksDataForVisibilityChange_Ro> {
    const links_data =
      await this._bookmarks_data_source.get_links_data_for_visibility_change(
        params,
      )

    const results: GetLinksDataForVisibilityChange_Ro = []

    for (const link_data of links_data) {
      results.push({
        url: link_data.url
          ? link_data.url
          : await Crypto.AES.decrypt(link_data.url_aes!, encryption_key),
        plain_text: link_data.plain_text
          ? link_data.plain_text
          : link_data.plain_text_aes
          ? await Crypto.AES.decrypt(link_data.plain_text_aes, encryption_key)
          : undefined,
        content: link_data.content
          ? link_data.content
          : link_data.content_aes
          ? await Crypto.AES.decrypt(link_data.content_aes, encryption_key)
          : undefined,
      })
    }

    return results
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
        ? await Crypto.AES.decrypt(bookmark.title_aes, encryption_key)
        : undefined,
      note: bookmark.note
        ? bookmark.note
        : bookmark.note_aes
        ? await Crypto.AES.decrypt(bookmark.note_aes, encryption_key)
        : undefined,
      is_unread: bookmark.is_unread || false,
      stars: bookmark.stars || 0,
      points: bookmark.points,
      tags: await Promise.all(
        bookmark.tags.map(async (tag) => ({
          id: tag.id,
          name: tag.name
            ? tag.name
            : await Crypto.AES.decrypt(tag.name_aes!, encryption_key),
          is_public: tag.is_public || false,
        })),
      ),
      links: await Promise.all(
        bookmark.links.map(async (link) => {
          let site_path: string | undefined
          if (link.is_public) {
            site_path = link.site_path
          } else {
            const site = await Crypto.AES.decrypt(
              link.site_aes!,
              encryption_key,
            )
            const domain = `${get_domain_from_url(site)}/`
            site_path = site.slice(domain.length)
          }
          return {
            url: link.is_public
              ? link.url!
              : await Crypto.AES.decrypt(link.url_aes!, encryption_key),
            site_path,
            saves: link.saves,
            is_public: link.is_public || false,
            is_pinned: link.is_pinned,
            pin_title: link.pin_title
              ? link.pin_title
              : link.pin_title_aes
              ? await Crypto.AES.decrypt(link.pin_title_aes, encryption_key)
              : undefined,
            open_snapshot: link.open_snapshot,
            favicon: link.favicon_aes
              ? await Crypto.AES.decrypt(link.favicon_aes, encryption_key)
              : undefined,
            has_plain_text: link.has_plain_text,
            has_content: link.has_content,
          }
        }),
      ),
      cover: bookmark.cover
        ? bookmark.cover
        : bookmark.cover_aes
        ? await Crypto.AES.decrypt(bookmark.cover_aes, encryption_key)
        : undefined,
    }
  }

  public async delete_bookmark(params: DeleteBookmark_Params): Promise<void> {
    await this._bookmarks_data_source.delete_bookmark(params)
  }

  public async record_visit(params: RecordVisit_Params): Promise<void> {
    await this._bookmarks_data_source.record_visit(params)
  }
}
