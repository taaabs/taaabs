import { ToggleFollowing_Dto } from '@shared/types/modules/users/toggle-following.dto'
import { ToggleFollowing_Params } from '../domain/toggle-following.params'
import { CheckFollowing_Params } from '../domain/check-following.params'
import { CheckFollowing_Dto } from '@shared/types/modules/users/check-following.dto'
import { KyInstance } from 'ky'
import { UserConnection_DataSource } from './user-connection.data-source'

export class UserConnection_DataSourceImpl
  implements UserConnection_DataSource
{
  constructor(private readonly _ky: KyInstance) {}

  public async toggle_following(
    params: ToggleFollowing_Params,
  ): Promise<ToggleFollowing_Dto.Response> {
    const body: ToggleFollowing_Dto.Body = {
      username: params.username,
    }
    return this._ky
      .post(`v1/users/toggle-following`, {
        json: body,
      })
      .json()
  }

  public async check_following(
    params: CheckFollowing_Params,
  ): Promise<CheckFollowing_Dto.Response> {
    const body: CheckFollowing_Dto.Body = {
      username: params.username,
    }
    return this._ky
      .post(`v1/users/check-following`, {
        json: body,
      })
      .json()
  }
}
