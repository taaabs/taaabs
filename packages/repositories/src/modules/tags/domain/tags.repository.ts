import { Tags_Ro } from './tags.ro'
import { Rename_Params } from './rename.params'

export type Tags_Repository = {
  tags(encryption_key: Uint8Array): Promise<Tags_Ro>
  rename(params: Rename_Params, encryption_key: Uint8Array): Promise<void>
}
