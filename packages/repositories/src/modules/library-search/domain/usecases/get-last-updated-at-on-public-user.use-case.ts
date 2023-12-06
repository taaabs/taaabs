import { UseCase } from '@repositories/core/use-case'
import { LibrarySearch_Repository } from '../repositories/library-search.repository'
import { GetLastUpdated_Params } from '../types/get-last-updated.params'
import { GetLastUpdated_Ro } from '../types/get-last-updated.ro'

export class GetLastUpdatedAtOnPublicUser_UseCase
  implements UseCase<Promise<GetLastUpdated_Ro>, GetLastUpdated_Params.Public>
{
  constructor(
    private readonly _library_search_repository: LibrarySearch_Repository,
  ) {}

  public invoke(
    params: GetLastUpdated_Params.Public,
  ): Promise<GetLastUpdated_Ro> {
    return this._library_search_repository.get_last_updated_at_on_public_user(
      params,
    )
  }
}
