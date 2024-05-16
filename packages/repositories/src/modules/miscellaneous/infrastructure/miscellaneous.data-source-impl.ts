import { UsernameAvailability_Dto } from '@shared/types/modules/users/username-availability.dto'
import { Miscellaneous_DataSource } from './miscellaneous.data-source'
import { UsernameAvailability } from '../domain/username-availability'
import { KyInstance } from 'ky'

export class Miscellaneous_DataSourceImpl implements Miscellaneous_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async check_username_availability(
    params: UsernameAvailability.Params,
  ): Promise<UsernameAvailability_Dto.Response> {
    const body: UsernameAvailability_Dto.Body = {
      username: params.username,
    }

    return this._ky
      .post(`v1/users/username-availability`, {
        json: body,
      })
      .json()
  }
}
