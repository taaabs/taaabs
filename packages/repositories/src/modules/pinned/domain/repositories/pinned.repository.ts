import { GetPinned_Params } from '../types/get-pinned.params'
import { GetPinned_Ro } from '../types/get-pinned.ro'
import { UpdatePinned_Params } from '../types/update-pinned.params'

export type Pinned_Repository = {
  get_pinned_authorized(encryption_key: Uint8Array): Promise<GetPinned_Ro>
  get_pinned_public(params: GetPinned_Params.Public): Promise<GetPinned_Ro>
  update_pinned(
    params: UpdatePinned_Params,
    encryption_key: Uint8Array,
  ): Promise<GetPinned_Ro>
}
