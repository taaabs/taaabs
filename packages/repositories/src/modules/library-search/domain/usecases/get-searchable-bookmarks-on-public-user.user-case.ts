import { UseCase } from '@repositories/core/use-case'
import { GetBookmarks_Ro } from '../types/get-bookmarks.ro'
import { GetBookmarks_Params } from '../types/get-bookmarks.params'
import { LibrarySearch_Repository } from '../repositories/library-search.repository'

export class GetSearchableBookmarksOnPublicUser_UseCase
  implements UseCase<Promise<GetBookmarks_Ro>, GetBookmarks_Params.Public>
{
  constructor(
    private readonly _library_search_repository: LibrarySearch_Repository,
  ) {}

  public invoke(params: GetBookmarks_Params.Public): Promise<GetBookmarks_Ro> {
    return this._library_search_repository.get_bookmarks_on_public_user(params)
  }
}
