import { UpdateUsername_Params } from '../domain/update-username.params'

export type Settings_DataSource = {
  update_username(params: UpdateUsername_Params): Promise<void>
  delete_account(): Promise<void>
}
