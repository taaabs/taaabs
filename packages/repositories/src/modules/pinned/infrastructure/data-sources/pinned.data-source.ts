import { Pinned_Dto } from '@shared/types/modules/pinned/pinned.dto'
import { GetPinned_Params } from '../../domain/types/get-pinned.params'

export type Pinned_DataSource = {
  get_pinned_authorized(): Promise<Pinned_Dto.Response>
  get_pinned_public(
    params: GetPinned_Params.Public,
  ): Promise<Pinned_Dto.Response>
}
