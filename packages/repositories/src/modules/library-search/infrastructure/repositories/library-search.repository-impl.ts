import { LibrarySearch_Repository } from '../../domain/repositories/library-search.repository'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { GetBookmarks_Ro } from '../../domain/types/get-bookmarks.ro'
import { LibrarySearch_DataSource } from '../data-sources/library-search.data-source'

export class LibrarySearch_RepositoryImpl implements LibrarySearch_Repository {
  constructor(
    private readonly _library_search_data_source: LibrarySearch_DataSource,
  ) {}

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
          title: bookmark.title,
          is_unread: bookmark.is_unread || false,
          is_archived: bookmark.is_archived || false,
          sites: bookmark.sites,
          tags: bookmark.tags || [],
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
          is_unread: false,
          is_archived: bookmark.is_archived || false,
          sites: bookmark.sites,
          tags: bookmark.tags || [],
          stars: bookmark.stars || 0,
        }
      }),
    }
  }
}
