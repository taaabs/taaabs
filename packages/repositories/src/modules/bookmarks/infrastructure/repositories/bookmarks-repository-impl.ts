import { BookmarksRepository } from '@/modules/bookmarks/domain/repositories/bookmarks.repository'
import { BookmarksDataSource } from '../datasources/bookmarks-data-source'
import { BookmarksRo } from '@/modules/bookmarks/domain/types/bookmarks.ro'
import { BookmarksOnUserDto } from '@shared/dtos/modules/bookmarks/bookmarks-on-user.dto'

export class BookmarksRepositoryImpl implements BookmarksRepository {
  constructor(private readonly _bookmarksDataSource: BookmarksDataSource) {}

  async getBookmarksOnCurrentUser({
    params,
  }: {
    params: BookmarksOnUserDto.QueryParams.Authorized
  }): Promise<BookmarksRo.OnCurrentUser> {
    const { bookmarks, pagination } =
      await this._bookmarksDataSource.getBookmarksOnCurrentUser({ params })

    return {
      bookmarks: bookmarks.map((bookmark) => {
        return {
          id: bookmark.id,
          createdAt: new Date(bookmark.created_at),
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

  async getBookmarksOnOtherUser({
    username,
    params,
  }: {
    username: string
    params: BookmarksOnUserDto.QueryParams.Public
  }): Promise<BookmarksRo.OnOtherUser> {
    const { bookmarks, pagination } =
      await this._bookmarksDataSource.getBookmarksOnOtherUser({
        username,
        params,
      })

    return {
      bookmarks: bookmarks.map((bookmark) => ({
        id: bookmark.id,
        createdAt: new Date(bookmark.created_at),
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
