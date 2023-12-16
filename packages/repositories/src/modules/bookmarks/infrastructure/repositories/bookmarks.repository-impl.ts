import CryptoJS from 'crypto-js'
import { Bookmarks_Repository } from '../../domain/repositories/bookmarks.repository'
import { Bookmarks_DataSource } from '../data-sources/bookmarks.data-source'
import { GetBookmarks_Ro } from '../../domain/types/get-bookmarks.ro'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { RecordVisit_Params } from '../../domain/types/record-visit.params'
import { DeleteBookmark_Params } from '../../domain/types/delete-bookmark.params'
import { UpsertBookmark_Params } from '../../domain/types/upsert-bookmark.params'
import { GetBookmarksByIds_Ro } from '../../domain/types/get-bookmarks-by-ids.ro'
import { GetBookmarksByIds_Params } from '../../domain/types/get-bookmarks-by-ids.params'
import { RecordVisit_Ro } from '../../domain/types/record-visit.ro'
import { Bookmark_Entity } from '../../domain/entities/bookmark.entity'

export class Bookmarks_RepositoryImpl implements Bookmarks_Repository {
  constructor(private readonly _bookmarks_data_source: Bookmarks_DataSource) {}

  public async get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<GetBookmarks_Ro> {
    const { bookmarks, pagination } =
      await this._bookmarks_data_source.get_bookmarks_on_authorized_user(params)

    return {
      bookmarks: bookmarks.map((bookmark) => ({
        id: bookmark.id,
        is_public: bookmark.title !== undefined,
        created_at: bookmark.created_at,
        updated_at: bookmark.updated_at,
        visited_at: bookmark.visited_at,
        title: bookmark.title
          ? bookmark.title
          : CryptoJS.AES.decrypt(bookmark.title_aes!, 'my_secret_key').toString(
              CryptoJS.enc.Utf8,
            ),
        note: bookmark.note
          ? bookmark.note
          : bookmark.note_aes
          ? CryptoJS.AES.decrypt(bookmark.note_aes, 'my_secret_key').toString(
              CryptoJS.enc.Utf8,
            )
          : undefined,
        is_unread: bookmark.is_unread || false,
        stars: bookmark.stars || 0,
        tags: bookmark.tags.map((tag) => ({
          id: tag.id,
          name: tag.name
            ? tag.name
            : CryptoJS.AES.decrypt(tag.name_aes!, 'my_secret_key').toString(
                CryptoJS.enc.Utf8,
              ),
          is_public: tag.is_public || false,
        })),
        links: bookmark.links.map((link) => ({
          url: link.is_public
            ? link.url!
            : CryptoJS.AES.decrypt(link.url_aes!, 'my_secret_key').toString(
                CryptoJS.enc.Utf8,
              ),
          saves: link.saves,
          // site_path: link.site_path,
          is_public: link.is_public || false,
        })),
      })),
      pagination: {
        has_more: pagination.has_more,
      },
    }
  }

  public async get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<GetBookmarks_Ro> {
    const { bookmarks, pagination } =
      await this._bookmarks_data_source.get_bookmarks_on_public_user(params)

    return {
      bookmarks: bookmarks.map((bookmark) => ({
        id: bookmark.id,
        is_public: true,
        created_at: bookmark.created_at,
        updated_at: bookmark.updated_at,
        visited_at: bookmark.visited_at,
        title: bookmark.title,
        note: bookmark.note,
        is_unread: bookmark.is_unread || false,
        stars: bookmark.stars || 0,
        tags: bookmark.tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
          is_public: true,
        })),
        links: bookmark.links.map((link) => ({
          url: link.url,
          saves: link.saves,
          // site_path: link.site,
          is_public: true,
        })),
      })),
      pagination: {
        has_more: pagination.has_more,
      },
    }
  }

  public async get_bookmarks_by_ids_authorized(
    params: GetBookmarksByIds_Params.Authorized,
  ): Promise<GetBookmarksByIds_Ro> {
    const { bookmarks } =
      await this._bookmarks_data_source.get_bookmarks_by_ids_authorized(params)

    return {
      bookmarks: bookmarks.map((bookmark) => ({
        id: bookmark.id,
        is_public: bookmark.title !== undefined,
        created_at: bookmark.created_at,
        updated_at: bookmark.updated_at,
        visited_at: bookmark.visited_at,
        title: bookmark.title
          ? bookmark.title
          : CryptoJS.AES.decrypt(bookmark.title_aes!, 'my_secret_key').toString(
              CryptoJS.enc.Utf8,
            ),
        note: bookmark.note
          ? bookmark.note
          : bookmark.note_aes
          ? CryptoJS.AES.decrypt(bookmark.note_aes, 'my_secret_key').toString(
              CryptoJS.enc.Utf8,
            )
          : undefined,
        is_unread: bookmark.is_unread || false,
        stars: bookmark.stars || 0,
        tags: bookmark.tags.map((tag) => ({
          id: tag.id,
          name: tag.name
            ? tag.name
            : CryptoJS.AES.decrypt(tag.name_aes!, 'my_secret_key').toString(
                CryptoJS.enc.Utf8,
              ),
          is_public: tag.is_public || false,
        })),
        links: bookmark.links.map((link) => ({
          url: link.is_public
            ? link.url!
            : CryptoJS.AES.decrypt(link.url_aes!, 'my_secret_key').toString(
                CryptoJS.enc.Utf8,
              ),
          saves: link.saves,
          // site_path: link.site_path,
          is_public: link.is_public || false,
        })),
      })),
    }
  }

  public async get_bookmarks_by_ids_public(
    params: GetBookmarksByIds_Params.Public,
  ): Promise<GetBookmarksByIds_Ro> {
    const { bookmarks } =
      await this._bookmarks_data_source.get_bookmarks_by_ids_public(params)

    return {
      bookmarks: bookmarks.map((bookmark) => ({
        id: bookmark.id,
        created_at: bookmark.created_at,
        updated_at: bookmark.updated_at,
        visited_at: bookmark.visited_at,
        title: bookmark.title,
        note: bookmark.note,
        is_public: true,
        is_unread: bookmark.is_unread || false,
        stars: bookmark.stars || 0,
        tags: bookmark.tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
          is_public: true,
        })),
        links: bookmark.links.map((link) => ({
          url: link.url,
          saves: link.saves,
          // site_path: link.site_path,
          is_public: true,
        })),
      })),
    }
  }

  public async record_visit(
    params: RecordVisit_Params,
  ): Promise<RecordVisit_Ro> {
    const { visited_at } =
      await this._bookmarks_data_source.record_visit(params)

    return { visited_at: new Date(visited_at) }
  }

  public delete_bookmark(params: DeleteBookmark_Params): Promise<void> {
    return this._bookmarks_data_source.delete_bookmark(params)
  }

  public async upsert_bookmark(
    params: UpsertBookmark_Params,
  ): Promise<Bookmark_Entity> {
    const bookmark = await this._bookmarks_data_source.upsert_bookmark(params)

    return {
      id: bookmark.id,
      is_public: bookmark.title !== undefined,
      created_at: bookmark.created_at,
      updated_at: bookmark.updated_at,
      visited_at: bookmark.visited_at,
      title: bookmark.title
        ? bookmark.title
        : CryptoJS.AES.decrypt(bookmark.title_aes!, 'my_secret_key').toString(
            CryptoJS.enc.Utf8,
          ),
      note: bookmark.note
        ? bookmark.note
        : bookmark.note_aes
        ? CryptoJS.AES.decrypt(bookmark.note_aes, 'my_secret_key').toString(
            CryptoJS.enc.Utf8,
          )
        : undefined,
      is_unread: bookmark.is_unread || false,
      stars: bookmark.stars || 0,
      tags: bookmark.tags.map((tag) => ({
        id: tag.id,
        name: tag.name
          ? tag.name
          : CryptoJS.AES.decrypt(tag.name_aes!, 'my_secret_key').toString(
              CryptoJS.enc.Utf8,
            ),
        is_public: tag.is_public || false,
      })),
      links: bookmark.links.map((link) => ({
        url: link.is_public
          ? link.url!
          : CryptoJS.AES.decrypt(link.url_aes!, 'my_secret_key').toString(
              CryptoJS.enc.Utf8,
            ),
        saves: link.saves,
        // site_path: link.site_path,
        is_public: link.is_public || false,
      })),
    }
  }
}
