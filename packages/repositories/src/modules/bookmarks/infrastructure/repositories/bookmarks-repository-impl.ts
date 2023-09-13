import { BookmarksRepository } from '@repositories/modules/bookmarks/domain/repositories/bookmarks.repository'
import { BookmarksDataSource } from '../data-sources/bookmarks-data-source'
import { BookmarksRo } from '@repositories/modules/bookmarks/domain/types/bookmarks.ro'
import { BookmarksParams } from '../../domain/types/bookmarks.params'

export class BookmarksRepositoryImpl implements BookmarksRepository {
  constructor(private readonly _bookmarksDataSource: BookmarksDataSource) {}

  public async getBookmarksOnAuthorizedUser(
    params: BookmarksParams.Authorized,
  ): Promise<BookmarksRo.Authorized> {
    const { bookmarks, pagination } =
      await this._bookmarksDataSource.getBookmarksOnAuthorizedUser(params)

    return {
      bookmarks: bookmarks.map((bookmark) => {
        return {
          id: bookmark.id,
          createdAt: bookmark.created_at,
          updatedAt: bookmark.updated_at,
          note: bookmark.note,
          title: bookmark.title,
          isNsfw: bookmark.is_nsfw || false,
          isStarred: bookmark.is_starred || false,
          tags: bookmark.tags.map((tag) => ({ id: tag.id, name: tag.name })),
          links: bookmark.links.map((link) => ({
            url: link.url,
            saves: link.saves,
          })),
          isPublic: bookmark.is_public || false,
        }
      }),
      pagination: {
        hasMore: pagination.hasMore,
      },
    }
  }

  public async getBookmarksOnPublicUser(
    params: BookmarksParams.Public,
  ): Promise<BookmarksRo.Public> {
    const { bookmarks, pagination } =
      await this._bookmarksDataSource.getBookmarksOnPublicUser(params)

    return {
      bookmarks: bookmarks.map((bookmark) => ({
        id: bookmark.id,
        createdAt: bookmark.created_at,
        updatedAt: bookmark.updated_at,
        note: bookmark.note,
        title: bookmark.title,
        isNsfw: bookmark.is_nsfw || false,
        isStarred: bookmark.is_starred || false,
        tags: bookmark.tags.map((tag) => ({ id: tag.id, name: tag.name })),
        links: bookmark.links.map((link) => ({
          url: link.url,
          saves: link.saves,
        })),
      })),
      pagination: {
        hasMore: pagination.hasMore,
      },
    }
  }
}
