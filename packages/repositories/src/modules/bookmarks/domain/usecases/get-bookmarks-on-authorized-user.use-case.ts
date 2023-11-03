import { Bookmarks_Repository } from '../repositories/bookmarks.repository'
import { UseCase } from '@repositories/core/use-case'
import { GetBookmarks_Ro } from '../types/get-bookmarks.ro'
import { GetBookmarks_Params } from '../types/get-bookmarks.params'

export class GetBookmarksOnAuthorizedUser_UseCase
  implements UseCase<Promise<GetBookmarks_Ro>, GetBookmarks_Params.Authorized>
{
  constructor(private readonly _bookmarks_repository: Bookmarks_Repository) {}

  public invoke(params: GetBookmarks_Params.Authorized) {
    return this._bookmarks_repository.get_bookmarks_on_authorized_user(params)
  }
}
