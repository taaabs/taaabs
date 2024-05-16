import { UpdateUsername_Params } from '../../domain/types/update-username.params'

export type Settings_DataSource = {
  update_username(params: UpdateUsername_Params): Promise<void>
}
