import { UseCase } from '@repositories/core/use-case'
import { UpdateUsername_Params } from '../types/update-username.params'
import { Settings_Repository } from '../repositories/settings.repository'

export class UpdateUsername_UseCase
  implements UseCase<Promise<void>, UpdateUsername_Params>
{
  constructor(private readonly _settings_repository: Settings_Repository) {}

  public invoke(params: UpdateUsername_Params): Promise<void> {
    return this._settings_repository.update_username(params)
  }
}
