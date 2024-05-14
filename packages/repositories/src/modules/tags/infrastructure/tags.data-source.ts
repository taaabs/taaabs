import { RenameTag_Params } from '../domain/rename-tag.params'

export type Tags_DataSource = {
  rename(params: RenameTag_Params, encryption_key: Uint8Array): Promise<void>
}
