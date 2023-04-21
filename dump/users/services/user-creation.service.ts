import { Injectable } from '@nestjs/common'
import { CreateUserDto } from '@taaabs/shared'
import { UsersRepository } from '../repositories/users.repository'

@Injectable()
export class UserCreationService {
  constructor(private _usersRepository: UsersRepository) {}

  public async createUser(dto: CreateUserDto): Promise<void> {
    await this._usersRepository.create(dto)
    // TODO send welcome email
  }

  // private async _sendWelcomeEmail(email: string): Promise<void> {
  //   // TODO
  // }
}
