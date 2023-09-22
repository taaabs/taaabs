import { UsernameAvailability_Dto } from '@shared/types/modules/users/username-availability.dto'
import { Settings_DataSource } from './settings.data-source'
import { UsernameAvailability } from '../../domain/types/username-availability'
import { MyUsername_Dto } from '@shared/types/modules/users/my-username.dto'
import { UpdateUsername } from '../../domain/types/update-username'
import { UpdateUser_Dto } from '@shared/types/modules/users/update-user.dto'

export class Settings_DataSourceImpl implements Settings_DataSource {
  constructor(private readonly _api_url: string) {}

  public async get_my_username(): Promise<MyUsername_Dto.Response> {
    return fetch(`${this._api_url}/v1/user/my-username`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
      },
    }).then((r) => r.json())
  }

  public async check_username_availability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability_Dto.Response> {
    const body: UsernameAvailability_Dto.Body = {
      username: params.username,
    }

    return fetch(`${this._api_url}/v1/user/username-availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
      },
      body: JSON.stringify(body),
    }).then((r) => r.json())
  }

  public async update_username(params: UpdateUsername.Params): Promise<void> {
    const body: UpdateUser_Dto.Body = {
      username: params.username,
    }

    await fetch(`${this._api_url}/v1/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NzVhYzkyMS00MjA2LTQwYmMtYmJmNS01NjRjOWE2NDdmMmUiLCJpYXQiOjE2OTUyOTc3MDB9.gEnNaBw72l1ETDUwS5z3JUQy3qFhm_rwBGX_ctgzYbg',
      },
      body: JSON.stringify(body),
    })
  }
}
