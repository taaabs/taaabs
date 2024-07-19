import { All_Ro } from './all.ro'
import { Rename_Params } from './rename.params'

export type Tags_Repository = {
  all(encryption_key: Uint8Array): Promise<All_Ro>
  rename(params: Rename_Params, encryption_key: Uint8Array): Promise<void>
}
