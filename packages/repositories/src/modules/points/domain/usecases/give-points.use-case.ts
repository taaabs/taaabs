import { UseCase } from '@repositories/core/use-case'
import { GivePoints_Params } from '../types/give-points.params'
import { Points_Repository } from '../repositories/points.repository'

export class GivePoints_UseCase
  implements UseCase<Promise<void>, GivePoints_Params>
{
  constructor(private readonly _points_repository: Points_Repository) {}

  public invoke(params: GivePoints_Params): Promise<void> {
    return this._points_repository.give_points(params)
  }
}
