import { Points_Repository } from '../../domain/repositories/points.repository'
import { CheckTotalGivenPoints_Params } from '../../domain/types/check-total-given-points.params'
import { GivePoints_Params } from '../../domain/types/give-points.params'
import { Points_DataSource } from '../data-sources/points.data-source'

export class Points_RepositoryImpl implements Points_Repository {
  constructor(private readonly _points_data_source: Points_DataSource) {}

  public async give_points(params: GivePoints_Params): Promise<void> {
    await this._points_data_source.give_points(params)
  }

  public async check_total_given_points(
    params: CheckTotalGivenPoints_Params,
  ): Promise<number> {
    return (await this._points_data_source.check_total_given_points(params))
      .points
  }
}
