import { LibrarySearch_Repository } from '../../domain/repositories/library-search.repository'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { GetBookmarks_Ro } from '../../domain/types/get-bookmarks.ro'
import { GetLastUpdated_Ro } from '../../domain/types/get-last-updated.ro'
import { LibrarySearch_DataSource } from '../data-sources/library-search.data-source'
import { GetLastUpdatedAt_Params } from '../../domain/types/get-last-updated-at.params'
import { Crypto } from '@repositories/utils/crypto'
import pako from 'pako'

export class LibrarySearch_RepositoryImpl implements LibrarySearch_Repository {
  constructor(
    private readonly _library_search_data_source: LibrarySearch_DataSource,
  ) {}

  public async get_last_updated_at_on_authorized_user(): Promise<GetLastUpdated_Ro> {
    const result =
      await this._library_search_data_source.get_last_updated_on_authorized_user()

    return {
      updated_at: result.updated_at ? new Date(result.updated_at) : undefined,
      archived_updated_at: result.archived_updated_at
        ? new Date(result.archived_updated_at)
        : undefined,
    }
  }

  public async get_last_updated_at_on_public_user(
    params: GetLastUpdatedAt_Params.Public,
  ): Promise<GetLastUpdated_Ro> {
    const result =
      await this._library_search_data_source.get_last_updated_on_public_user(
        params,
      )

    return {
      updated_at: result.updated_at ? new Date(result.updated_at) : undefined,
      archived_updated_at: result.archived_updated_at
        ? new Date(result.archived_updated_at)
        : undefined,
    }
  }

  public async get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
    encryption_key: Uint8Array,
  ): Promise<GetBookmarks_Ro> {
    const { bookmarks } =
      await this._library_search_data_source.get_bookmarks_on_authorized_user(
        params,
      )

    return {
      bookmarks: await Promise.all(
        bookmarks.map(async (bookmark) => {
          return {
            id: bookmark.id,
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
            links: await Promise.all(
              bookmark.links.map(async (link) => {
                const site = link.site
                  ? link.site
                  : await Crypto.AES.decrypt(link.site_aes!, encryption_key)
                const plain_text = link.plain_text
                  ? link.plain_text
                  : link.plain_text_aes
                  ? new TextDecoder().decode(
                      pako.inflate(
                        Uint8Array.from(
                          atob(
                            await Crypto.AES.decrypt(
                              link.plain_text_aes,
                              encryption_key,
                            ),
                          ),
                          (c) => c.charCodeAt(0),
                        ),
                      ),
                    )
                  : undefined
                return { site, plain_text }
              }),
            ),
            tags: await Promise.all(
              bookmark.tags.map(async (tag) => ({
                id: tag.id,
                name: tag.name
                  ? tag.name
                  : await Crypto.AES.decrypt(tag.name_aes!, encryption_key),
              })),
            ),
            stars: bookmark.stars || 0,
            points: bookmark.points || 0,
          }
        }),
      ),
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
          title: bookmark.title,
          note: bookmark.note,
          links: bookmark.links,
          tags: bookmark.tags,
          stars: bookmark.stars || 0,
          points: bookmark.points || 0,
        }
      }),
    }
  }
}
