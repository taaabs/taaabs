import { Months_Repository } from '../../domain/repositories/months.repository'
import { Months_Params } from '../../domain/types/months.params'
import { Months_Ro } from '../../domain/types/months.ro'
import { Months_DataSource } from '../data-sources/months.data-source'

export class Months_RepositoryImpl implements Months_Repository {
  constructor(private readonly _months_data_source: Months_DataSource) {}

  public async get_months_on_authorized_user(
    params: Months_Params.Authorized,
  ): Promise<Months_Ro> {
    const data =
      await this._months_data_source.get_months_on_authorized_user(params)

    return {
      months: data.months,
      is_months_update_scheduled: data.is_months_update_scheduled,
    }
  }

  public async get_months_on_public_user(
    params: Months_Params.Public,
  ): Promise<Months_Ro> {
    const data =
      await this._months_data_source.get_months_on_public_user(params)

    return {
      months: data.months,
      is_months_update_scheduled: data.is_months_update_scheduled,
    }
  }
}
