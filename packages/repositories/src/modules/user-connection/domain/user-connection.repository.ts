import { CheckFollowing_Params } from './check-following.params'
import { CheckFollowing_Ro } from './check-following.ro'
import { ToggleFollowing_Params } from './toggle-following.params'
import { ToggleFollowing_Ro } from './toggle-following.ro'

export type UserConnection_Repository = {
  toggle_following(params: ToggleFollowing_Params): Promise<ToggleFollowing_Ro>
  check_following(params: CheckFollowing_Params): Promise<CheckFollowing_Ro>
}
