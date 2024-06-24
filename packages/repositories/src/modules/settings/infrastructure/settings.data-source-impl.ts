import { Settings_DataSource } from './settings.data-source'
import { UpdateUser_Dto } from '@shared/types/modules/users/update-user.dto'
import { KyInstance } from 'ky'
import { UpdateUsername_Params } from '../domain/update-username.params'

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

  public async delete_account(): Promise<void> {
    await this._ky.post(`v1/users/delete-account`)
  }
}
