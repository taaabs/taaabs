import { UseCase } from '@repositories/core/use-case'
import { UpdateUsername } from '../types/update-username'
import { Settings_Repository } from '../repositories/settings.repository'

export class UpdateUsername_UseCase
  implements UseCase<Promise<void>, UpdateUsername.Params>
{
  constructor(private readonly _settings_repository: Settings_Repository) {}

  public invoke(params: UpdateUsername.Params): Promise<void> {
    return this._settings_repository.update_username(params)
  }
}
