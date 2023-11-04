import { UseCase } from '@repositories/core/use-case'
import { UpsertBookmark_Params } from '../types/upsert-bookmark.params'
import { Bookmarks_Repository } from '../repositories/bookmarks.repository'

export class UpsertBookmark_UseCase
  implements UseCase<Promise<void>, UpsertBookmark_Params>
{
  constructor(private readonly _bookmarks_repository: Bookmarks_Repository) {}

  public invoke(params: UpsertBookmark_Params): Promise<void> {
    return this._bookmarks_repository.upsert_bookmark(params)
  }
}
