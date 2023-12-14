import { Counts_Dto } from '@shared/types/modules/counts/counts.dto'
import { Counts_Params } from '../../domain/types/counts.params'

export type Counts_DataSource = {
  get_counts_on_authorized_user(
    params: Counts_Params.Authorized,
  ): Promise<Counts_Dto.Response.Authorized>

  get_counts_on_public_user(
    params: Counts_Params.Public,
  ): Promise<Counts_Dto.Response.Public>
}
