import { GivePoints_Dto } from '@shared/types/modules/points/give-points.dto'
import { GivePoints_Params } from '../../domain/types/give-points.params'
import { Points_DataSource } from './points.data-source'
import { CheckTotalGivenPoints_Params } from '../../domain/types/check-total-given-points.params'
import { CheckTotalGivenPoints_Dto } from '@shared/types/modules/points/check-total-given-points.dto'
import { KyInstance } from 'ky'

export class Points_DataSourceImpl implements Points_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async give_points(params: GivePoints_Params): Promise<void> {
    const body: GivePoints_Dto.Request.Body = {
      receiver_username: params.receiver_username,
      bookmark_id: params.bookmark_id,
      points: params.points,
    }

    await this._ky.post('v1/points', {
      json: body,
    })
  }

  public async check_total_given_points(
    params: CheckTotalGivenPoints_Params,
  ): Promise<CheckTotalGivenPoints_Dto.Response> {
    const body: CheckTotalGivenPoints_Dto.Request.Body = {
      bookmark_id: params.bookmark_id,
      receiver_username: params.receiver_username,
    }
    return this._ky
      .post('v1/check-total-given', {
        json: body,
      })
      .json()
  }
}
