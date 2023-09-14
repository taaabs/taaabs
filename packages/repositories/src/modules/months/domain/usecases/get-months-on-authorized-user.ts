import { UseCase } from '@repositories/core/use-case'
import { MonthsRo } from '../types/months.ro'
import { MonthsParams } from '../types/months.params'
import { MonthsRepository } from '../repositories/months.repository'

export class GetMonthsOnAuthorizedUser
  implements UseCase<Promise<MonthsRo.Authorized>, MonthsParams.Authorized>
{
  constructor(private readonly _months_repository: MonthsRepository) {}

  public invoke(params: MonthsParams.Authorized) {
    return this._months_repository.get_months_on_authorized_user(params)
  }
}
