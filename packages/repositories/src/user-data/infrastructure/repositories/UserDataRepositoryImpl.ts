import { UserData } from '../../domain/entities/UserData'
import { UserDataRepository } from '../../domain/repositories/UserDataRepository'
import { UserDataDataSource } from '../datasources/UserDataDataSource'

export class UserDataRepositoryImpl implements UserDataRepository {
  constructor(private _userDataDataSource: UserDataDataSource) {}

  async getUserData(): Promise<UserData> {
    const userData = await this._userDataDataSource.getUserData()
    // decode encrypted data

    return userData
  }
}
