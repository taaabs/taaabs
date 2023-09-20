import { Months_Params } from '../types/months.params'
import { Months_Ro } from '../types/months.ro'

export type Months_Repository = {
  get_months_on_authorized_user(
    params: Months_Params.Authorized,
  ): Promise<Months_Ro.Authorized>

  get_months_on_public_user(
    params: Months_Params.Public,
  ): Promise<Months_Ro.Public>
}
