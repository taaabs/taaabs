import { All_Ro } from './all.ro'
import { Rename_Params } from './rename.params'
import { Suggested_Params } from './suggested.params'
import { Suggested_Ro } from './suggested.ro'

export type Tags_Repository = {
  all(encryption_key: Uint8Array): Promise<All_Ro>
  suggested(params: Suggested_Params): Promise<Suggested_Ro>
  rename(params: Rename_Params, encryption_key: Uint8Array): Promise<void>
}
