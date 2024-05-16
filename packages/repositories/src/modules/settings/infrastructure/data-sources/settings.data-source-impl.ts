import { Settings_DataSource } from './settings.data-source'
import { UpdateUsername_Params } from '../../domain/types/update-username.params'
import { UpdateUser_Dto } from '@shared/types/modules/users/update-user.dto'
import { KyInstance } from 'ky'

export class Settings_DataSourceImpl implements Settings_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async update_username(params: UpdateUsername_Params): Promise<void> {
    const body: UpdateUser_Dto.Body = {
      username: params.username,
    }

    await this._ky.patch(`v1/users`, {
      json: body,
    })
  }
}
