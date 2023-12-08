import { NoParams, UseCase } from '@repositories/core/use-case'
import { LibrarySearch_Repository } from '../repositories/library-search.repository'
import { GetLastUpdated_Ro } from '../types/get-last-updated.ro'

export class GetLastUpdatedAtOnAuthorizedUser_UseCase
  implements UseCase<Promise<GetLastUpdated_Ro>, NoParams>
{
  constructor(
    private readonly _library_search_repository: LibrarySearch_Repository,
  ) {}

  public invoke(): Promise<GetLastUpdated_Ro> {
    return this._library_search_repository.get_last_updated_at_on_authorized_user()
  }
}
