import { UseCase } from '@repositories/core/use-case'
import { Counts_Ro } from '../types/counts.ro'
import { Counts_Params } from '../types/counts.params'
import { Counts_Repository } from '../repositories/counts.repository'

export class GetCountsOnPublicUser_UseCase
  implements UseCase<Promise<Counts_Ro>, Counts_Params.Public>
{
  constructor(private readonly _counts_repository: Counts_Repository) {}

  public invoke(params: Counts_Params.Public) {
    return this._counts_repository.get_counts_on_public_user(params)
  }
}
