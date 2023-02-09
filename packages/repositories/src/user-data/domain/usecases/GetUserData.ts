import { NoParams, UseCase } from '@/core/UseCase'
import { UserData } from '../entities/UserData'
import { UserDataRepository } from '../repositories/UserDataRepository'

export class GetUserData implements UseCase<Promise<UserData>, NoParams> {
  constructor(private _repository: UserDataRepository) {}

  async invoke(): Promise<UserData> {
    return this._repository.getUserData()
  }
}
