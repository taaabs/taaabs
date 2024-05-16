import { UsernameAvailability } from './username-availability'

export type Miscellaneous_Repository = {
  check_username_availability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability.Response>
}
