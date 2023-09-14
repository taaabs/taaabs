import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { UseCase } from '@repositories/core/use-case'
import { BookmarksRo } from '../types/bookmarks.ro'
import { BookmarksParams } from '../types/bookmarks.params'

export class GetBookmarksOnAuthorizedUser
  implements
    UseCase<Promise<BookmarksRo.Authorized>, BookmarksParams.Authorized>
{
  constructor(private readonly _bookmarks_repository: BookmarksRepository) {}

  public invoke(params: BookmarksParams.Authorized) {
    return this._bookmarks_repository.get_bookmarks_on_authorized_user(params)
  }
}
