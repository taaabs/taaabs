import { UseCase } from '@repositories/core/use-case'
import { MonthsRo } from '../types/months.ro'
import { MonthsParams } from '../types/months.params'
import { MonthsRepository } from '../repositories/months.repository'

export class GetMonthsOnAuthorizedUser
  implements UseCase<Promise<MonthsRo.Authorized>, MonthsParams.Authorized>
{
  constructor(private readonly _monthsRepository: MonthsRepository) {}

  public invoke(params: MonthsParams.Authorized) {
    return this._monthsRepository.getMonthsOnAuthorizedUser(params)
  }
}
