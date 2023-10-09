import { Months_Dto } from '@shared/types/modules/months/months.dto'
import { Months_Params } from '../../domain/types/months.params'

export type Months_DataSource = {
  get_months_on_authorized_user(
    params: Months_Params.Authorized,
  ): Promise<Months_Dto.Response>

  get_months_on_public_user(
    params: Months_Params.Public,
  ): Promise<Months_Dto.Response>
}
