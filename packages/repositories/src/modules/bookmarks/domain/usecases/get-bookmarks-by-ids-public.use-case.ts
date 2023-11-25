import { Bookmarks_Repository } from '../repositories/bookmarks.repository'
import { UseCase } from '@repositories/core/use-case'
import { GetBookmarksByIds_Params } from '../types/get-bookmarks-by-ids.params'
import { GetBookmarksByIds_Ro } from '../types/get-bookmarks-by-ids.ro'

export class GetBookmarksByIdsAuthorized_UseCase
  implements
    UseCase<Promise<GetBookmarksByIds_Ro>, GetBookmarksByIds_Params.Public>
{
  constructor(private readonly _bookmarks_repository: Bookmarks_Repository) {}

  public invoke(params: GetBookmarksByIds_Params.Public) {
    return this._bookmarks_repository.get_bookmarks_by_ids_public(params)
  }
}
