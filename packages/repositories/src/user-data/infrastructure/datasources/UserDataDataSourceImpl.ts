import { AxiosInstance, AxiosResponse } from 'axios'
import { UserDataDto } from 'taaabs-types/dtos'
import { UserDataDataSource } from './UserDataDataSource'

export class UserDataDataSourceImpl implements UserDataDataSource {
  constructor(private _axios: AxiosInstance) {}

  async getUserData(): Promise<UserDataDto> {
    const response: AxiosResponse<UserDataDto> = await this._axios.get(
      `/v1/user-data`,
    )

    return response.data
  }
}
