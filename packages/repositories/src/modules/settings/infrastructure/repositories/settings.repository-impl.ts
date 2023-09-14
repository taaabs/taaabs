import { SettingsRepository } from '../../domain/repositories/settings.repository'
import { UsernameAvailability } from '../../domain/types/username-availability'
import { SettingsDataSource } from '../data-sources/settings-data-source'

export class SettingsRepositoryImpl implements SettingsRepository {
  constructor(private readonly _settings_data_source: SettingsDataSource) {}

  public async check_username_availability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability.Response> {
    const data =
      await this._settings_data_source.check_username_availability(params)

    return {
      is_available: data.is_available,
    }
  }
}
