import { UseCase } from '@repositories/core/use-case'
import { Months_Ro } from '../types/months.ro'
import { Months_Params } from '../types/months.params'
import { Months_Repository } from '../repositories/months.repository'

export class GetMonthsOnAuthorizedUser_UseCase
  implements UseCase<Promise<Months_Ro.Authorized>, Months_Params.Authorized>
{
  constructor(private readonly _months_repository: Months_Repository) {}

  public invoke(params: Months_Params.Authorized) {
    return this._months_repository.get_months_on_authorized_user(params)
  }
}
