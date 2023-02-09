import { UserDataDto } from 'taaabs-types/dtos'

export type UserDataDataSource = {
  getUserData(): Promise<UserDataDto>
}
