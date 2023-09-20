import { MonthsDto } from '@shared/types/modules/months/months.dto'
import { Months_Params } from '../../domain/types/months.params'

export type Months_DataSource = {
  get_months_on_authorized_user(
    params: Months_Params.Authorized,
  ): Promise<MonthsDto.Response.Authorized>

  get_months_on_public_user(
    params: Months_Params.Public,
  ): Promise<MonthsDto.Response.Public>
}
