import { UsernameAvailability } from '../types/username-availability'

export type SettingsRepository = {
  check_username_availability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability.Response>
}
