import { LibrarySearch_Repository } from '../../domain/repositories/library-search.repository'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { GetBookmarks_Ro } from '../../domain/types/get-bookmarks.ro'
import { LibrarySearch_DataSource } from '../data-sources/library-search.data-source'
import { AES } from '@repositories/utils/aes'

export class LibrarySearch_RepositoryImpl implements LibrarySearch_Repository {
  constructor(
    private readonly _library_search_data_source: LibrarySearch_DataSource,
  ) {}

  public async get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
    encryption_key: Uint8Array,
  ): Promise<GetBookmarks_Ro> {
    const result =
      await this._library_search_data_source.get_bookmarks_on_authorized_user(
        params,
      )

    const bookmarks: GetBookmarks_Ro['bookmarks'] = []

    for (const bookmark of result.bookmarks) {
      const tags: GetBookmarks_Ro['bookmarks'][0]['tags'] = []
      for (const tag of bookmark.tags) {
        tags.push({
          id: tag.id,
          name: tag.name
            ? tag.name
            : await AES.decrypt(tag.name_aes!, encryption_key),
        })
      }

      const links: GetBookmarks_Ro['bookmarks'][0]['links'] = []
      for (const link of bookmark.links) {
        links.push({
          site: link.site
            ? link.site
            : await AES.decrypt(link.site_aes!, encryption_key),
        })
      }

      const title = bookmark.title
        ? bookmark.title
        : bookmark.title_aes
        ? await AES.decrypt(bookmark.title_aes, encryption_key)
        : undefined

      const note = bookmark.note
        ? bookmark.note
        : bookmark.note_aes
        ? await AES.decrypt(bookmark.note_aes, encryption_key)
        : undefined

      bookmarks.push({
        id: bookmark.id,
        created_at: bookmark.created_at,
        updated_at: bookmark.updated_at,
        visited_at: bookmark.visited_at,
        title,
        note,
        links,
        tags,
        // This is due to our approach of handling unsorted status
        is_unsorted:
          bookmark.is_unsorted === undefined
            ? true
            : bookmark.is_unsorted || undefined,
        is_deleted: bookmark.is_deleted,
        stars: bookmark.stars || 0,
        points: bookmark.points || 0,
        views: bookmark.views || 0,
      })
    }

    return {
      bookmarks,
      version: result.version,
    }
  }

  public async get_bookmarks_on_public_user(
    params: GetBookmarks_Params.Public,
  ): Promise<GetBookmarks_Ro> {
    const { bookmarks, version } =
      await this._library_search_data_source.get_bookmarks_on_public_user(
        params,
      )

    return {
      bookmarks: bookmarks.map((bookmark) => {
        return {
          id: bookmark.id,
          created_at: bookmark.created_at,
          updated_at: bookmark.updated_at,
          is_deleted: bookmark.is_deleted,
          title: bookmark.title,
          note: bookmark.note,
          links: bookmark.links,
          tags: bookmark.tags,
          stars: bookmark.stars || 0,
          points: bookmark.points || 0,
          views: 0,
        }
      }),
      version,
    }
  }
}
