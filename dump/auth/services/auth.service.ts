import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { stringify as uuidStringify } from 'uuid'
import { UsersRepository } from '../../users/repositories/users.repository'

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersRepository: UsersRepository,
    private readonly _jwtService: JwtService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<string | null> {
    const user = await this._usersRepository.oneByEmail(email)
    if (user && user.password == password) {
      return uuidStringify(user.id)
    }
    return null
  }

  public async login(user: User) {
    const payload = { id: user.id }
    return {
      access_token: this._jwtService.sign(payload),
    }
  }
}
