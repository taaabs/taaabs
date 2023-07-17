import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { UseCase } from '@repositories/core/use-case'
import { BookmarksRo } from '../types/bookmarks.ro'
import { BookmarksParams } from '../types/bookmarks.params'

export class GetBookmarksOnAuthorizedUser
  implements
    UseCase<Promise<BookmarksRo.Authorized>, BookmarksParams.Authorized>
{
  constructor(private readonly _bookmarksRepository: BookmarksRepository) {}

  public invoke(params: BookmarksParams.Authorized) {
    return this._bookmarksRepository.getBookmarksOnAuthorizedUser(params)
  }
}
