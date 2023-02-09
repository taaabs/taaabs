import { UserData } from '../entities/UserData'

export type UserDataRepository = {
  getUserData(): Promise<UserData>
}
