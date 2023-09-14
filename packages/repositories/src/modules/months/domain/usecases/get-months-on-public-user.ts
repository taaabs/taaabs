import { UseCase } from '@repositories/core/use-case'
import { MonthsRo } from '../types/months.ro'
import { MonthsParams } from '../types/months.params'
import { MonthsRepository } from '../repositories/months.repository'

export class GetMonthsOnPublicUser
  implements UseCase<Promise<MonthsRo.Public>, MonthsParams.Public>
{
  constructor(private readonly _months_repository: MonthsRepository) {}

  public invoke(params: MonthsParams.Public) {
    return this._months_repository.get_months_on_public_user(params)
  }
}
