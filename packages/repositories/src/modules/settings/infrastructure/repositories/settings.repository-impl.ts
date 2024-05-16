import { Settings_Repository } from '../../domain/repositories/settings.repository'
import { UpdateUsername_Params } from '../../domain/types/update-username.params'
import { Settings_DataSource } from '../data-sources/settings.data-source'

export class Settings_RepositoryImpl implements Settings_Repository {
  constructor(private readonly _settings_data_source: Settings_DataSource) {}

  public async update_username(params: UpdateUsername_Params): Promise<void> {
    return this._settings_data_source.update_username(params)
  }
}
