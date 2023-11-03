import { UseCase } from '@repositories/core/use-case'
import { DeleteBookmark_Params } from '../types/delete-bookmark.params'
import { Bookmarks_Repository } from '../repositories/bookmarks.repository'

export class DeleteBookmark_UseCase
  implements UseCase<Promise<void>, DeleteBookmark_Params>
{
  constructor(private readonly _bookmarks_repository: Bookmarks_Repository) {}

  public invoke(params: DeleteBookmark_Params): Promise<void> {
    return this._bookmarks_repository.delete_bookmark(params)
  }
}
