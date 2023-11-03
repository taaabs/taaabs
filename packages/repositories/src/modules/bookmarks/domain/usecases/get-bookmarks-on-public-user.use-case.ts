import { Bookmarks_Repository } from '../repositories/bookmarks.repository'
import { UseCase } from '@repositories/core/use-case'
import { GetBookmarks_Ro } from '../types/get-bookmarks.ro'
import { GetBookmarks_Params } from '../types/get-bookmarks.params'

export class GetBookmarksOnPublicUser_UseCase
  implements UseCase<Promise<GetBookmarks_Ro>, GetBookmarks_Params.Public>
{
  constructor(private readonly _bookmarks_repository: Bookmarks_Repository) {}

  public invoke(params: GetBookmarks_Params.Public) {
    return this._bookmarks_repository.get_bookmarks_on_public_user(params)
  }
}
