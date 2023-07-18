import { UseCase } from '@repositories/core/use-case'
import { MonthsRo } from '../types/months.ro'
import { MonthsParams } from '../types/months.params'
import { MonthsRepository } from '../repositories/months.repository'

export class GetMonthsOnPublicUser
  implements UseCase<Promise<MonthsRo.Public>, MonthsParams.Public>
{
  constructor(private readonly _monthsRepository: MonthsRepository) {}

  public invoke(params: MonthsParams.Public) {
    return this._monthsRepository.getMonthsOnPublicUser(params)
  }
}
