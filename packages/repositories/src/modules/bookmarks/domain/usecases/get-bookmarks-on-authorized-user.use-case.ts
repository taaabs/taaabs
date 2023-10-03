import { Bookmarks_Repository } from '../repositories/bookmarks.repository'
import { UseCase } from '@repositories/core/use-case'
import { Bookmarks_Ro } from '../types/bookmarks.ro'
import { Bookmarks_Params } from '../types/bookmarks.params'

export class GetBookmarksOnAuthorizedUser_UseCase
  implements UseCase<Promise<Bookmarks_Ro>, Bookmarks_Params.Authorized>
{
  constructor(private readonly _bookmarks_repository: Bookmarks_Repository) {}

  public invoke(params: Bookmarks_Params.Authorized) {
    return this._bookmarks_repository.get_bookmarks_on_authorized_user(params)
  }
}
