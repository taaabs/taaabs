import { BookmarksRepository } from '@repositories/modules/bookmarks/domain/repositories/bookmarks.repository'
import { BookmarksDataSource } from '../data-sources/bookmarks-data-source'
import { BookmarksRo } from '@repositories/modules/bookmarks/domain/types/bookmarks.ro'
import { BookmarksParams } from '../../domain/types/bookmarks.params'

export class BookmarksRepositoryImpl implements BookmarksRepository {
  constructor(private readonly _bookmarksDataSource: BookmarksDataSource) {}

  public async get_bookmarks_on_authorized_user(
    params: BookmarksParams.Authorized,
  ): Promise<BookmarksRo.Authorized> {
    const { bookmarks, pagination } =
      await this._bookmarksDataSource.get_bookmarks_on_authorized_user(params)

    return {
      bookmarks: bookmarks.map((bookmark) => {
        return {
          id: bookmark.id,
          created_at: bookmark.created_at,
          updated_at: bookmark.updated_at,
          note: bookmark.note,
          title: bookmark.title,
          is_nsfw: bookmark.is_nsfw || false,
          is_starred: bookmark.is_starred || false,
          tags: bookmark.tags.map((tag) => ({ id: tag.id, name: tag.name })),
          links: bookmark.links.map((link) => ({
            url: link.url,
            saves: link.saves,
          })),
          is_public: bookmark.is_public || false,
        }
      }),
      pagination: {
        has_more: pagination.has_more,
      },
    }
  }

  public async get_bookmarks_on_public_user(
    params: BookmarksParams.Public,
  ): Promise<BookmarksRo.Public> {
    const { bookmarks, pagination } =
      await this._bookmarksDataSource.get_bookmarks_on_public_user(params)

    return {
      bookmarks: bookmarks.map((bookmark) => ({
        id: bookmark.id,
        created_at: bookmark.created_at,
        updated_at: bookmark.updated_at,
        note: bookmark.note,
        title: bookmark.title,
        is_nsfw: bookmark.is_nsfw || false,
        is_starred: bookmark.is_starred || false,
        tags: bookmark.tags.map((tag) => ({ id: tag.id, name: tag.name })),
        links: bookmark.links.map((link) => ({
          url: link.url,
          saves: link.saves,
        })),
      })),
      pagination: {
        has_more: pagination.has_more,
      },
    }
  }
}
