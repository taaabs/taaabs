import { UsernameAvailability_Dto } from '@shared/types/modules/users/username-availability.dto'
import { Settings_DataSource } from './settings.data-source'
import { UsernameAvailability } from '../../domain/types/username-availability'
import { UpdateUsername_Params } from '../../domain/types/update-username.params'
import { UpdateUser_Dto } from '@shared/types/modules/users/update-user.dto'
import { KyInstance } from 'ky'

export class Settings_DataSourceImpl implements Settings_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async check_username_availability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability_Dto.Response> {
    const body: UsernameAvailability_Dto.Body = {
      username: params.username,
    }

    return this._ky
      .post(`v1/users/username-availability`, {
        body: JSON.stringify(body),
      })
      .json()
  }

  public async update_username(params: UpdateUsername_Params): Promise<void> {
    const body: UpdateUser_Dto.Body = {
      username: params.username,
    }

    await this._ky.patch(`v1/users`, {
      body: JSON.stringify(body),
    })
  }
}
