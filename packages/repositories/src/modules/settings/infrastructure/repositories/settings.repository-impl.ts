import { Settings_Repository } from '../../domain/repositories/settings.repository'
import { MyUsername } from '../../domain/types/my-username'
import { UpdateUsername_Params } from '../../domain/types/update-username.params'
import { UsernameAvailability } from '../../domain/types/username-availability'
import { Settings_DataSource } from '../data-sources/settings.data-source'

export class Settings_RepositoryImpl implements Settings_Repository {
  constructor(private readonly _settings_data_source: Settings_DataSource) {}

  public async get_my_username(): Promise<MyUsername.Response> {
    const { username } = await this._settings_data_source.get_my_username()

    return {
      username,
    }
  }

  public async check_username_availability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability.Response> {
    const { is_available } =
      await this._settings_data_source.check_username_availability(params)

    return {
      is_available,
    }
  }

  public async update_username(params: UpdateUsername_Params): Promise<void> {
    return this._settings_data_source.update_username(params)
  }
}
