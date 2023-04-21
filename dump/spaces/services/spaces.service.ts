import { stringify as uuidStringify } from 'uuid'
import { Injectable } from '@nestjs/common'
import { SpacesRepository } from '../repositories/spaces.repository'
import { PublicSpaceDataResponseDto } from '@taaabs/shared'

@Injectable()
export class SpacesService {
  constructor(private readonly _spacesRepository: SpacesRepository) {}

  public async getPublicSpaceData({
    username,
    slug,
  }: {
    username: string
    slug: string
  }): Promise<PublicSpaceDataResponseDto> {
    try {
      const collections =
        await this._spacesRepository.publicCollectionsOnSpaceByUsernameAndSpaceSlug({
          username,
          slug,
        })

      return {
        collections: collections.map((collection) => ({
          name: collection.name,
          id: uuidStringify(collection.id),
          parentId: collection.parentId && uuidStringify(collection.parentId),
          updatedAt: collection.updatedAt.toISOString(),
        })),
      }
    } catch (error) {
      throw error
    }
  }
}
