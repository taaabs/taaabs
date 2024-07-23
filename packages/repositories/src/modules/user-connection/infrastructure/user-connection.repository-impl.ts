import { CheckFollowing_Params } from '../domain/check-following.params'
import { CheckFollowing_Ro } from '../domain/check-following.ro'
import { ToggleFollowing_Params } from '../domain/toggle-following.params'
import { ToggleFollowing_Ro } from '../domain/toggle-following.ro'
import { UserConnection_Repository } from '../domain/user-connection.repository'
import { UserConnection_DataSource } from './user-connection.data-source'

export class UserConnection_RepositoryImpl
  implements UserConnection_Repository
{
  constructor(
    private readonly _user_connection_data_source: UserConnection_DataSource,
  ) {}

  public async toggle_following(
    params: ToggleFollowing_Params,
  ): Promise<ToggleFollowing_Ro> {
    const result = await this._user_connection_data_source.toggle_following(
      params,
    )
    return {
      is_following: result.is_following,
    }
  }

  public async check_following(
    params: CheckFollowing_Params,
  ): Promise<CheckFollowing_Ro> {
    const result = await this._user_connection_data_source.check_following(
      params,
    )
    return {
      is_following: result.is_following,
    }
  }
}
