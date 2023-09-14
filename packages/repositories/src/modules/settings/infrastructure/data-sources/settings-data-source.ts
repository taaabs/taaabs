import { UsernameAvailabilityDto } from '@shared/types/modules/users/username-availability.dto'
import { UsernameAvailability } from '../../domain/types/username-availability'

export type SettingsDataSource = {
  check_username_availability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailabilityDto.Response>
}
