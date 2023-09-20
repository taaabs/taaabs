import { Bookmarks_Repository } from '../repositories/bookmarks.repository'
import { UseCase } from '@repositories/core/use-case'
import { Bookmarks_Ro } from '../types/bookmarks.ro'
import { Bookmarks_Params } from '../types/bookmarks.params'

export class GetBookmarksOnPublicUser_UseCase
  implements UseCase<Promise<Bookmarks_Ro.Public>, Bookmarks_Params.Public>
{
  constructor(private readonly _bookmarks_repository: Bookmarks_Repository) {}

  public invoke(params: Bookmarks_Params.Public) {
    return this._bookmarks_repository.get_bookmarks_on_public_user(params)
  }
}
