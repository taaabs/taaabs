import CryptoJS from 'crypto-js'
import { LibrarySearch_Repository } from '../../domain/repositories/library-search.repository'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { GetBookmarks_Ro } from '../../domain/types/get-bookmarks.ro'
import { GetLastUpdated_Params } from '../../domain/types/get-last-updated.params'
import { GetLastUpdated_Ro } from '../../domain/types/get-last-updated.ro'
import { LibrarySearch_DataSource } from '../data-sources/library-search.data-source'

export class LibrarySearch_RepositoryImpl implements LibrarySearch_Repository {
  constructor(
    private readonly _library_search_data_source: LibrarySearch_DataSource,
  ) {}

  public async get_last_updated_at_on_authorized_user(): Promise<GetLastUpdated_Ro> {
    const result =
      await this._library_search_data_source.get_last_updated_on_authorized_user()

    return {
      updated_at: result.updated_at ? new Date(result.updated_at) : undefined,
    }
  }

  public async get_last_updated_at_on_public_user(
    params: GetLastUpdated_Params.Public,
  ): Promise<GetLastUpdated_Ro> {
    const result =
      await this._library_search_data_source.get_last_updated_on_public_user(
        params,
      )

    return {
      updated_at: result.updated_at ? new Date(result.updated_at) : undefined,
    }
  }

  public async get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<GetBookmarks_Ro> {
    const { bookmarks } =
      await this._library_search_data_source.get_bookmarks_on_authorized_user(
        params,
      )

    return {
      bookmarks: bookmarks.map((bookmark) => {
        return {
          id: bookmark.id,
          created_at: bookmark.created_at,
          updated_at: bookmark.updated_at,
          visited_at: bookmark.visited_at,
          title: bookmark.title
            ? bookmark.title
            : CryptoJS.AES.decrypt(
                bookmark.title_aes!,
                'my_secret_key',
              ).toString(CryptoJS.enc.Utf8),
          note: bookmark.note
            ? bookmark.note
            : bookmark.note_aes
            ? CryptoJS.AES.decrypt(bookmark.note_aes, 'my_secret_key').toString(
                CryptoJS.enc.Utf8,
              )
            : undefined,
          is_unread: bookmark.is_unread || false,
          is_archived: bookmark.is_archived || false,
          sites: bookmark.sites.map((site) => {
            if (site.site) {
              return site.site
            } else {
              return CryptoJS.AES.decrypt(
                site.site_aes!,
                'my_secret_key',
              ).toString(CryptoJS.enc.Utf8)
            }
          }),
          tags: bookmark.tags.map((tag) => {
            if (tag.name) {
              return tag.name
            } else {
              return CryptoJS.AES.decrypt(
                tag.name_aes!,
                'my_secret_key',
              ).toString(CryptoJS.enc.Utf8)
            }
          }),
          stars: bookmark.stars || 0,
        }
      }),
    }
  }

  public async get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<GetBookmarks_Ro> {
    const { bookmarks } =
      await this._library_search_data_source.get_bookmarks_on_public_user(
        params,
      )

    return {
      bookmarks: bookmarks.map((bookmark) => {
        return {
          id: bookmark.id,
          created_at: bookmark.created_at,
          updated_at: bookmark.updated_at,
          visited_at: 0,
          title: bookmark.title,
          note: bookmark.note,
          is_unread: false,
          is_archived: bookmark.is_archived || false,
          is_public: false,
          sites: bookmark.sites,
          tags: bookmark.tags,
          stars: bookmark.stars || 0,
        }
      }),
    }
  }
}
