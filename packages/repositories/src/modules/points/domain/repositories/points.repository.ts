import { CheckTotalGivenPoints_Params } from '../types/check-total-given-points.params'
import { GivePoints_Params } from '../types/give-points.params'

export type Points_Repository = {
  give_points(params: GivePoints_Params): Promise<void>
  check_total_given_points(
    params: CheckTotalGivenPoints_Params,
  ): Promise<number>
}
