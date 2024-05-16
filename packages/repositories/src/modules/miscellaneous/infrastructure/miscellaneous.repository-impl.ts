import { Miscellaneous_Repository } from '../domain/miscellaneous.repository'
import { UsernameAvailability } from '../domain/username-availability'
import { Miscellaneous_DataSource } from './miscellaneous.data-source'

export class Miscellaneous_RepositoryImpl implements Miscellaneous_Repository {
  constructor(
    private readonly _miscellaneous_data_source: Miscellaneous_DataSource,
  ) {}

  public async check_username_availability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability.Response> {
    const { is_available } =
      await this._miscellaneous_data_source.check_username_availability(params)

    return {
      is_available,
    }
  }
}
