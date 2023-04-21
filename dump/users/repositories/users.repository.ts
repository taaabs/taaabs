import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import {
  CollectionType,
  Space,
  StandardTypeVisibility,
  User,
} from '@prisma/client'
import { v4 as uuidV4, parse as uuidParse } from 'uuid'
import * as argon2 from 'argon2'
import { CreateUserDto } from '@taaabs/shared'

@Injectable()
export class UsersRepository {
  // TODO: logger

  constructor(private _prismaService: PrismaService) {}

  public async create(dto: CreateUserDto): Promise<User> {
    const { email, password, username } = dto

    try {
      const user = await this._prismaService.user.create({
        data: {
          id: Buffer.from(uuidParse(uuidV4())),
          username,
          email,
          password: await argon2.hash(password),
        },
      })

      return user
    } catch (error) {
      throw error
    }
  }

  public async oneByEmail(email: string): Promise<User> {
    try {
      return await this._prismaService.user.findUniqueOrThrow({
        where: { email },
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Public space is a space that has at least one public collection
   */
  public async publicSpacesOnUserByUsername({
    username,
  }: {
    username: string
  }): Promise<Space[]> {
    try {
      const { spaces } = await this._prismaService.user.findUniqueOrThrow({
        where: {
          username,
        },
        select: {
          spaces: {
            where: {
              collections: {
                some: {
                  AND: [
                    { collectionType: CollectionType.STANDARD },
                    { standardTypeVisibility: StandardTypeVisibility.PUBLIC },
                  ],
                },
              },
            },
          },
        },
      })

      return spaces
    } catch (error) {
      throw error
    }
  }
}
