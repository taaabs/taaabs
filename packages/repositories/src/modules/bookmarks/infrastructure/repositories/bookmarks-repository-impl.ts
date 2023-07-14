import { BookmarksRepository } from '@repositories/modules/bookmarks/domain/repositories/bookmarks.repository'
import { BookmarksDataSource } from '../data-sources/bookmarks-data-source'
import { BookmarksRo } from '@repositories/modules/bookmarks/domain/types/bookmarks.ro'
import { BookmarksParams } from '../../domain/types/bookmarks.params'

export class BookmarksRepositoryImpl implements BookmarksRepository {
  constructor(private readonly _bookmarksDataSource: BookmarksDataSource) {}

  public async getBookmarksOnAuthorizedUser(
    params: BookmarksParams.AuthorizedUser,
  ): Promise<BookmarksRo.AuthorizedUser> {
    const { bookmarks, pagination } =
      await this._bookmarksDataSource.getBookmarksOnAuthorizedUser(params)

    return {
      bookmarks: bookmarks.map((bookmark) => {
        return {
          id: bookmark.id,
          createdAt: bookmark.created_at,
          text: bookmark.text || null,
          title: bookmark.title,
          isArchived: bookmark.is_archived || false,
          isNsfw: bookmark.is_nsfw || false,
          isStarred: bookmark.is_starred || false,
          saves: bookmark.saves || 0,
          tags: bookmark.tags || [],
          url: bookmark.url,
          sitePath: bookmark.site_path || null,
          isPublic: bookmark.is_public || false,
        }
      }),
      pagination: {
        hasMore: pagination.hasMore,
      },
    }
  }

  public async getBookmarksOnOtherUser(
    params: BookmarksParams.OtherUser,
  ): Promise<BookmarksRo.OtherUser> {
    const { bookmarks, pagination } =
      await this._bookmarksDataSource.getBookmarksOnOtherUser(params)

    return {
      bookmarks: bookmarks.map((bookmark) => ({
        id: bookmark.id,
        createdAt: bookmark.created_at,
        text: bookmark.text || null,
        title: bookmark.title,
        isArchived: bookmark.is_archived || false,
        isNsfw: bookmark.is_nsfw || false,
        isStarred: bookmark.is_starred || false,
        saves: bookmark.saves || 0,
        tags: bookmark.tags || [],
        url: bookmark.url,
        sitePath: bookmark.site_path || null,
      })),
      pagination: {
        hasMore: pagination.hasMore,
      },
    }
  }
}
