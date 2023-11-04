import { MyUsername } from '../types/my-username'
import { UpdateUsername_Params } from '../types/update-username.params'
import { UsernameAvailability } from '../types/username-availability'

export type Settings_Repository = {
  get_my_username(): Promise<MyUsername.Response>

  check_username_availability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability.Response>

  update_username(params: UpdateUsername_Params): Promise<void>
}
