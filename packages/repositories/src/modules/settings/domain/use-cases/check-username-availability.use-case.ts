import { UseCase } from '@repositories/core/use-case'
import { UsernameAvailability } from '../types/username-availability'
import { Settings_Repository } from '../repositories/settings.repository'

export class CheckUsernameAvailability_UseCase
  implements
    UseCase<
      Promise<UsernameAvailability.Response>,
      UsernameAvailability.Params
    >
{
  constructor(private readonly _settings_repository: Settings_Repository) {}

  public invoke(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability.Response> {
    return this._settings_repository.check_username_availability(params)
  }
}
