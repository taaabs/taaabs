import { UsernameAvailability } from '../types/username-availability'

export type SettingsRepository = {
  checkUsernameAvailability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability.Response>
}
