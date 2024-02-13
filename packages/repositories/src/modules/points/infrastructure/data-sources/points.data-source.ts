import { CheckTotalGivenPoints_Params } from '../../domain/types/check-total-given-points.params'
import { GivePoints_Params } from '../../domain/types/give-points.params'
import { CheckTotalGivenPoints_Dto } from '@shared/types/modules/points/check-total-given-points.dto'

export type Points_DataSource = {
  give_points(params: GivePoints_Params): Promise<void>
  check_total_given_points(
    params: CheckTotalGivenPoints_Params,
  ): Promise<CheckTotalGivenPoints_Dto.Response>
}
