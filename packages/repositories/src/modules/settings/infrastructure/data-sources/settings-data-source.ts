import { UsernameAvailabilityDto } from '@shared/types/modules/users/username-availability.dto'
import { UsernameAvailabilityParams } from '../../domain/types/username-availability.params'

export type SettingsDataSource = {
  checkUsernameAvailability(
    params: UsernameAvailabilityParams,
  ): Promise<UsernameAvailabilityDto.Response>
}
