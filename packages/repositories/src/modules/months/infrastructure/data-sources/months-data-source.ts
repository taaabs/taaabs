import { MonthsDto } from '@shared/types/modules/months/months.dto'
import { MonthsParams } from '../../domain/types/months.params'

export type MonthsDataSource = {
  get_months_on_authorized_user(
    params: MonthsParams.Authorized,
  ): Promise<MonthsDto.Response.Authorized>

  get_months_on_public_user(
    params: MonthsParams.Public,
  ): Promise<MonthsDto.Response.Public>
}
