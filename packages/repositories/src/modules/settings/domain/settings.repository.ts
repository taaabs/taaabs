import { UpdateUsername_Params } from './update-username.params'

export type Settings_Repository = {
  update_username(params: UpdateUsername_Params): Promise<void>
  delete_account(): Promise<void>
}
