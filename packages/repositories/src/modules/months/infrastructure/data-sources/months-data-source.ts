import { MonthsDto } from '@shared/types/modules/months/months.dto'
import { MonthsParams } from '../../domain/types/months.params'

export type MonthsDataSource = {
  getMonthsOnAuthorizedUser(
    params: MonthsParams.Authorized,
  ): Promise<MonthsDto.Response.Authorized>

  getMonthsOnPublicUser(
    params: MonthsParams.Public,
  ): Promise<MonthsDto.Response.Public>
}
