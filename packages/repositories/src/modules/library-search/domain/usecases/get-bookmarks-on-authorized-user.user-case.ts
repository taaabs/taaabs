import { UseCase } from '@repositories/core/use-case'
import { GetBookmarks_Ro } from '../types/get-bookmarks.ro'
import { GetBookmarks_Params } from '../types/get-bookmarks.params'
import { LibrarySearch_Repository } from '../repositories/library-search.repository'

export class GetBookmarksOnAuthorizedUser_UseCase
  implements UseCase<Promise<GetBookmarks_Ro>, GetBookmarks_Params.Authorized>
{
  constructor(private readonly _search_repository: LibrarySearch_Repository) {}

  public invoke(
    params: GetBookmarks_Params.Authorized,
  ): Promise<GetBookmarks_Ro> {
    return this._search_repository.get_bookmarks_on_authorized_user(params)
  }
}
