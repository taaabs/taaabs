import { Tags_Dto } from '@shared/types/modules/tags/tags.dto'
import { Rename_Params } from '../domain/rename.params'
import { Suggested_Params } from '../domain/suggested.params'
import { Suggested_Dto } from '@shared/types/modules/tags/suggested.dto'

export type Tags_DataSource = {
  all(): Promise<Tags_Dto>
  suggested(params: Suggested_Params): Promise<Suggested_Dto.Response>
  rename(params: Rename_Params, encryption_key: Uint8Array): Promise<void>
}
