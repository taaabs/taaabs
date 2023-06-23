import { BookmarksRepository } from '@/bookmarks/domain/repositories/bookmarks.repository'
import { BookmarksDataSource } from '../datasources/bookmarks-data-source'
import { BookmarksDto } from '@shared/dtos/v1/bookmarks/bookmarks-on-user.dto'
import { BookmarksRo } from '@/bookmarks/domain/types/bookmarks.ro'

export class BookmarksRepositoryImpl implements BookmarksRepository {
  constructor(private _bookmarksDataSource: BookmarksDataSource) {}

  async getBookmarksOnCurrentUser({
    params,
  }: {
    params: BookmarksDto.QueryParams.OnCurrentUser
  }): Promise<BookmarksRo.OnCurrentUser> {
    const { bookmarks, pagination } =
      await this._bookmarksDataSource.getBookmarksOnCurrentUser({ params })

    return {
      bookmarks: bookmarks.map((bookmark) => {
        return {
          id: bookmark.id,
          createdAt: bookmark.createdAt,
          text: bookmark.text,
          title: bookmark.title,
          isArchived: bookmark.isArchived || false,
          isNsfw: bookmark.isNsfw || false,
          isStarred: bookmark.isStarred || false,
          saves: bookmark.saves,
          tags: bookmark.tags || [],
          url: bookmark.url,
          sitePath: bookmark.sitePath,
          isPublic: bookmark.isPublic || false,
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
    params: BookmarksDto.QueryParams.OnOtherUser
  }): Promise<BookmarksRo.OnOtherUser> {
    const { bookmarks, pagination } =
      await this._bookmarksDataSource.getBookmarksOnOtherUser({
        username,
        params,
      })

    return {
      bookmarks: bookmarks.map((bookmark) => ({
        id: bookmark.id,
        createdAt: bookmark.createdAt,
        text: bookmark.text,
        title: bookmark.title,
        isArchived: bookmark.isArchived || false,
        isNsfw: bookmark.isNsfw || false,
        isStarred: bookmark.isStarred || false,
        saves: bookmark.saves,
        tags: bookmark.tags || [],
        url: bookmark.url,
        sitePath: bookmark.sitePath,
      })),
      pagination: {
        hasMore: pagination.hasMore,
      },
    }
  }
}
