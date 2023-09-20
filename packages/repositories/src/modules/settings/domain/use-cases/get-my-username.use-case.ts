import { NoParams, UseCase } from '@repositories/core/use-case'
import { MyUsername } from '../types/my-username'
import { Settings_Repository } from '../repositories/settings.repository'

export class GetMyUsername_UseCase
  implements UseCase<Promise<MyUsername.Response>, NoParams>
{
  constructor(private readonly _setings_repository: Settings_Repository) {}

  public invoke(): Promise<MyUsername.Response> {
    return this._setings_repository.get_my_username()
  }
}
