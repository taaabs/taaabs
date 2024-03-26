import { NoParams, UseCase } from '@repositories/core/use-case'
import { GetPinned_Ro } from '../types/get-pinned.ro'
import { Pinned_Repository } from '../repositories/pinned.repository'

export class GetPinnedAuthorized_UseCase
  implements UseCase<Promise<GetPinned_Ro>, NoParams>
{
  constructor(private readonly _pinned_repository: Pinned_Repository) {}

  public invoke() {
    return this._pinned_repository.get_pinned_authorized()
  }
}
