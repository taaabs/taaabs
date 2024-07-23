import { ToggleFollowing_Dto } from '@shared/types/modules/users/toggle-following.dto'
import { ToggleFollowing_Params } from '../domain/toggle-following.params'
import { CheckFollowing_Params } from '../domain/check-following.params'
import { CheckFollowing_Dto } from '@shared/types/modules/users/check-following.dto'

export type UserConnection_DataSource = {
  toggle_following(
    params: ToggleFollowing_Params,
  ): Promise<ToggleFollowing_Dto.Response>
  check_following(
    params: CheckFollowing_Params,
  ): Promise<CheckFollowing_Dto.Response>
}
