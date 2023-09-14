import { MonthsParams } from '../types/months.params'
import { MonthsRo } from '../types/months.ro'

export type MonthsRepository = {
  get_months_on_authorized_user(
    params: MonthsParams.Authorized,
  ): Promise<MonthsRo.Authorized>

  get_months_on_public_user(
    params: MonthsParams.Public,
  ): Promise<MonthsRo.Public>
}
