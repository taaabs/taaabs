import { Counts_Params } from '../types/counts.params'
import { Counts_Ro } from '../types/counts.ro'

export type Counts_Repository = {
  get_counts_on_authorized_user(
    params: Counts_Params.Authorized,
    encryption_key: Uint8Array,
  ): Promise<Counts_Ro>

  get_counts_on_public_user(params: Counts_Params.Public): Promise<Counts_Ro>
}
