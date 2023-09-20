import { Bookmarks_Repository } from '@repositories/modules/bookmarks/domain/repositories/bookmarks.repository'
import { Bookmarks_DataSource } from '../data-sources/bookmarks.data-source'
import { Bookmarks_Ro } from '@repositories/modules/bookmarks/domain/types/bookmarks.ro'
import { Bookmarks_Params } from '../../domain/types/bookmarks.params'

export class Bookmarks_RepositoryImpl implements Bookmarks_Repository {
  constructor(private readonly _bookmarksDataSource: Bookmarks_DataSource) {}

  public async get_bookmarks_on_authorized_user(
    params: Bookmarks_Params.Authorized,
  ): Promise<Bookmarks_Ro.Authorized> {
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
    params: Bookmarks_Params.Public,
  ): Promise<Bookmarks_Ro.Public> {
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
