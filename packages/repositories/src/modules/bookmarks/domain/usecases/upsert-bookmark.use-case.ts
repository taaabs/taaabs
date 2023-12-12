import { UseCase } from '@repositories/core/use-case'
import { UpsertBookmark_Params } from '../types/upsert-bookmark.params'
import { Bookmarks_Repository } from '../repositories/bookmarks.repository'
import { Bookmark_Entity } from '../entities/bookmark.entity'

export class UpsertBookmark_UseCase
  implements UseCase<Promise<Bookmark_Entity>, UpsertBookmark_Params>
{
  constructor(private readonly _bookmarks_repository: Bookmarks_Repository) {}

  public invoke(params: UpsertBookmark_Params): Promise<Bookmark_Entity> {
    return this._bookmarks_repository.upsert_bookmark(params)
  }
}
