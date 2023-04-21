import { Injectable } from '@nestjs/common'
import { Space } from '@prisma/client'
import { PublicUserDataResponseDto } from '@taaabs/shared'
import { stringify } from 'uuid'
import { UsersRepository } from '../repositories/users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly _usersRepository: UsersRepository) {}

  public async getPublicUserData({
    username,
  }: {
    username: string
  }): Promise<PublicUserDataResponseDto> {
    const spaces: Space[] =
      await this._usersRepository.publicSpacesOnUserByUsername({
        username,
      })

    return {
      spaces: spaces.map((space) => ({
        id: stringify(space.id),
        name: space.name,
        updatedAt: space.updatedAt.toISOString(),
      })),
    }
  }
}
