import { GivePoints_Dto } from '@shared/types/modules/points/give-points.dto'
import { GivePoints_Params } from '../../domain/types/give-points.params'
import { Points_DataSource } from './points.data-source'
import { CheckTotalGivenPoints_Params } from '../../domain/types/check-total-given-points.params'
import { CheckTotalGivenPoints_Dto } from '@shared/types/modules/points/check-total-given-points.dto'

export class Points_DataSourceImpl implements Points_DataSource {
  constructor(
    private readonly _api_url: string,
    private readonly _auth_token: string,
  ) {}

  public async give_points(params: GivePoints_Params): Promise<void> {
    const body: GivePoints_Dto.Body = {
      receiver_username: params.receiver_username,
      bookmark_id: params.bookmark_id,
      points: params.points,
    }

    await fetch(`${this._api_url}/v1/points`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._auth_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }

  public async check_total_given_points(
    params: CheckTotalGivenPoints_Params,
  ): Promise<CheckTotalGivenPoints_Dto.Response> {
    const body: CheckTotalGivenPoints_Dto.Body = {
      bookmark_id: params.bookmark_id,
      receiver_username: params.receiver_username,
    }
    return await fetch(`${this._api_url}/v1/points/check-total-given`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._auth_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((r) => {
      if (r.ok) {
        return r.json()
      } else {
        throw new Error()
      }
    })
  }
}
