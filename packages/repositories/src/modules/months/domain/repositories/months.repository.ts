import { MonthsParams } from '../types/months.params'
import { MonthsRo } from '../types/months.ro'

export type MonthsRepository = {
  getMonthsOnAuthorizedUser(
    params: MonthsParams.Authorized,
  ): Promise<MonthsRo.Authorized>

  getMonthsOnPublicUser(params: MonthsParams.Public): Promise<MonthsRo.Public>
}
