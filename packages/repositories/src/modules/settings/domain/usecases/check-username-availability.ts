import { UseCase } from '@repositories/core/use-case'
import { UsernameAvailability } from '../types/username-availability'
import { SettingsRepository } from '../repositories/settings.repository'

export class CheckUsernameAvailability
  implements
    UseCase<
      Promise<UsernameAvailability.Response>,
      UsernameAvailability.Params
    >
{
  constructor(private readonly _settingsRepository: SettingsRepository) {}

  public invoke(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability.Response> {
    return this._settingsRepository.checkUsernameAvailability(params)
  }
}
