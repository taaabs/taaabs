import { UseCase } from '@repositories/core/use-case'
import { GetPinned_Ro } from '../types/get-pinned.ro'
import { Pinned_Repository } from '../repositories/pinned.repository'
import { GetPinned_Params } from '../types/get-pinned.params'

export class GetPinnedAuthorized_UseCase
  implements UseCase<Promise<GetPinned_Ro>, GetPinned_Params.Public>
{
  constructor(private readonly _pinned_repository: Pinned_Repository) {}

  public invoke(params: GetPinned_Params.Public) {
    return this._pinned_repository.get_pinned_public(params)
  }
}
