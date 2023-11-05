import { Bookmarks_Repository } from '../../domain/repositories/bookmarks.repository'
import { Bookmarks_DataSource } from '../data-sources/bookmarks.data-source'
import { GetBookmarks_Ro } from '../../domain/types/get-bookmarks.ro'
import { GetBookmarks_Params } from '../../domain/types/get-bookmarks.params'
import { RecordVisit_Params } from '../../domain/types/record-visit.params'
import { DeleteBookmark_Params } from '../../domain/types/delete-bookmark.params'
import { UpsertBookmark_Params } from '../../domain/types/upsert-bookmark.params'

export class Bookmarks_RepositoryImpl implements Bookmarks_Repository {
  constructor(private readonly _bookmarks_data_source: Bookmarks_DataSource) {}

  public async get_bookmarks_on_authorized_user(
    params: GetBookmarks_Params.Authorized,
  ): Promise<GetBookmarks_Ro> {
    const { bookmarks, pagination } =
      await this._bookmarks_data_source.get_bookmarks_on_authorized_user(params)

    return {
      bookmarks: bookmarks.map((bookmark) => {
        return {
          id: bookmark.id,
          created_at: bookmark.created_at,
          updated_at: bookmark.updated_at,
          visited_at: bookmark.visited_at,
          title: bookmark.title,
          is_nsfw: bookmark.is_nsfw || false,
          is_starred: bookmark.is_starred || false,
          tags: bookmark.tags.map((tag) => ({
            id: tag.id,
            name: tag.name,
            is_public: tag.is_public || false,
          })),
          links: bookmark.links.map((link) => ({
            url: link.url,
            public_saves: link.public_saves,
            site_path: link.site_path,
            is_public: link.is_public || false,
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
    params: GetBookmarks_Params.Public,
  ): Promise<GetBookmarks_Ro> {
    const { bookmarks, pagination } =
      await this._bookmarks_data_source.get_bookmarks_on_public_user(params)

    return {
      bookmarks: bookmarks.map((bookmark) => ({
        id: bookmark.id,
        created_at: bookmark.created_at,
        updated_at: bookmark.updated_at,
        visited_at: bookmark.visited_at,
        title: bookmark.title,
        is_nsfw: bookmark.is_nsfw || false,
        is_starred: bookmark.is_starred || false,
        is_public: true,
        tags: bookmark.tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
          is_public: true,
        })),
        links: bookmark.links.map((link) => ({
          url: link.url,
          public_saves: link.public_saves,
          site_path: link.site_path,
          is_public: true,
        })),
      })),
      pagination: {
        has_more: pagination.has_more,
      },
    }
  }

  public record_visit(params: RecordVisit_Params): Promise<void> {
    return this._bookmarks_data_source.record_visit(params)
  }

  public delete_bookmark(params: DeleteBookmark_Params): Promise<void> {
    return this._bookmarks_data_source.delete_bookmark(params)
  }

  public upsert_bookmark(params: UpsertBookmark_Params): Promise<void> {
    return this._bookmarks_data_source.upsert_bookmark(params)
  }
}
