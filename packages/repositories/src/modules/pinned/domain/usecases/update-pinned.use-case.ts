import { UseCase } from '@repositories/core/use-case'
import { UpdatePinned_Params } from '../types/update-pinned.params'
import { Pinned_Repository } from '../repositories/pinned.repository'

export class UpdatePinned_UseCase
  implements UseCase<Promise<void>, UpdatePinned_Params>
{
  constructor(private readonly _pinned_repository: Pinned_Repository) {}

  public invoke(params: UpdatePinned_Params): Promise<void> {
    return this._pinned_repository.update_pinned(params)
  }
}
