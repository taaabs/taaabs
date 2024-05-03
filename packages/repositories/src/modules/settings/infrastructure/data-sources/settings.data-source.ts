import { UsernameAvailability_Dto } from '@shared/types/modules/users/username-availability.dto'
import { UsernameAvailability } from '../../domain/types/username-availability'
import { UpdateUsername_Params } from '../../domain/types/update-username.params'

export type Settings_DataSource = {
  check_username_availability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability_Dto.Response>

  update_username(params: UpdateUsername_Params): Promise<void>
}
