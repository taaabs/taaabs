import { Tags_Dto } from '@shared/types/modules/tags/tags.dto'
import { Rename_Params } from '../domain/rename.params'

export type Tags_DataSource = {
  tags(): Promise<Tags_Dto>
  rename(params: Rename_Params, encryption_key: Uint8Array): Promise<void>
}
