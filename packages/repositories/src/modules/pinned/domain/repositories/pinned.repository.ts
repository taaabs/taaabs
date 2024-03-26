import { GetPinned_Params } from '../types/get-pinned.params'
import { GetPinned_Ro } from '../types/get-pinned.ro'

export type Pinned_Repository = {
  get_pinned_authorized(): Promise<GetPinned_Ro>
  get_pinned_public(params: GetPinned_Params.Public): Promise<GetPinned_Ro>
}
