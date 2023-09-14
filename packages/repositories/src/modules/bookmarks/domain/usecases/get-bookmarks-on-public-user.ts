import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { UseCase } from '@repositories/core/use-case'
import { BookmarksRo } from '../types/bookmarks.ro'
import { BookmarksParams } from '../types/bookmarks.params'

export class GetBookmarksOnPublicUser
  implements UseCase<Promise<BookmarksRo.Public>, BookmarksParams.Public>
{
  constructor(private readonly _bookmarks_repository: BookmarksRepository) {}

  public invoke(params: BookmarksParams.Public) {
    return this._bookmarks_repository.get_bookmarks_on_public_user(params)
  }
}
