import { MyUsername } from '../types/my-username'
import { UpdateUsername } from '../types/update-username'
import { UsernameAvailability } from '../types/username-availability'

export type Settings_Repository = {
  get_my_username(): Promise<MyUsername.Response>

  check_username_availability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability.Response>

  update_username(params: UpdateUsername.Params): Promise<void>
}
