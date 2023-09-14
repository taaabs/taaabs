import { UsernameAvailabilityDto } from '@shared/types/modules/users/username-availability.dto'
import { SettingsDataSource } from './settings-data-source'
import { UsernameAvailability } from '../../domain/types/username-availability'

export class SettingsDataSourceImpl implements SettingsDataSource {
  constructor(private readonly _api_url: string) {}

  public async check_username_availability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailabilityDto.Response> {
    const body: UsernameAvailabilityDto.Body = {
      username: params.username,
    }

    return fetch(`${this._api_url}/v1/users/username-availability`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODJkZDJmMC04Y2UwLTQ4MzEtYTUyNy1kYmRhZTdkMDlkMzIiLCJpYXQiOjE2OTM0ODk2NTF9.3PVXbFsvC_dlypWsx-G8eS3Y8ggAyqZsUnIlZOKBGcM',
      },
      body: JSON.stringify(body),
    }).then((r) => r.json())
  }
}
