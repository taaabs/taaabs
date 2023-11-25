import { Counts_Repository } from '../../domain/repositories/counts.repository'
import { Counts_Params } from '../../domain/types/counts.params'
import { Counts_Ro } from '../../domain/types/counts.ro'
import { Counts_DataSource } from '../data-sources/counts.data-source'

export class Counts_RepositoryImpl implements Counts_Repository {
  constructor(private readonly _counts_data_source: Counts_DataSource) {}

  public async get_counts_on_authorized_user(
    params: Counts_Params.Authorized,
  ): Promise<Counts_Ro> {
    const data =
      await this._counts_data_source.get_counts_on_authorized_user(params)

    return {
      months: data.months,
      is_counts_update_scheduled: data.is_counts_update_scheduled,
    }
  }

  public async get_counts_on_public_user(
    params: Counts_Params.Public,
  ): Promise<Counts_Ro> {
    const data =
      await this._counts_data_source.get_counts_on_public_user(params)

    return {
      months: data.months,
      is_counts_update_scheduled: data.is_counts_update_scheduled,
    }
  }
}
