import { UpdateUsername_Params } from '../types/update-username.params'

export type Settings_Repository = {
  update_username(params: UpdateUsername_Params): Promise<void>
}
