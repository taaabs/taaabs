import { SettingsRepository } from '../../domain/repositories/settings.repository'
import { UsernameAvailability } from '../../domain/types/username-availability'
import { SettingsDataSource } from '../data-sources/settings-data-source'

export class SettingsRepositoryImpl implements SettingsRepository {
  constructor(private readonly _settingsDataSource: SettingsDataSource) {}

  public async checkUsernameAvailability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability.Response> {
    const data = await this._settingsDataSource.checkUsernameAvailability(
      params,
    )

    return {
      isAvailable: data.is_available,
    }
  }
}
