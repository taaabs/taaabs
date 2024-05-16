import { UsernameAvailability_Dto } from '@shared/types/modules/users/username-availability.dto'
import { UsernameAvailability } from '../domain/username-availability'

export type Miscellaneous_DataSource = {
  check_username_availability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability_Dto.Response>
}
