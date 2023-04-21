import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import {
  Collection,
  CollectionType,
  StandardTypeVisibility,
} from '@prisma/client'

@Injectable()
export class SpacesRepository {
  constructor(private _prismaService: PrismaService) {}

  public async publicCollectionsOnSpaceByUsernameAndSpaceSlug({
    username,
    slug,
  }: {
    username: string
    slug: string
  }): Promise<Collection[]> {
    try {
      const user = await this._prismaService.user.findFirstOrThrow({
        where: {
          username,
        },
      })
      const space = await this._prismaService.space.findFirstOrThrow({
        where: { creatorId: user.id, slug },
        select: {
          collections: {
            where: {
              collectionType: CollectionType.STANDARD,
              standardTypeVisibility: StandardTypeVisibility.PUBLIC,
            },
          },
        },
      })
      return space.collections
    } catch (error) {
      throw error
    }
  }
}
