import { UseCase } from '@repositories/core/use-case'
import { Points_Repository } from '../repositories/points.repository'
import { CheckTotalGivenPoints_Params } from '../types/check-total-given-points.params'

export class CheckTotalGivenPoints_UseCase
  implements UseCase<Promise<number>, CheckTotalGivenPoints_Params>
{
  constructor(private readonly _points_repository: Points_Repository) {}

  public invoke(params: CheckTotalGivenPoints_Params): Promise<number> {
    return this._points_repository.check_total_given_points(params)
  }
}
