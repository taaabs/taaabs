import { Collection } from '@prisma/client'
import { testPublicCollection } from '@/test/test-data'
import { SpacesRepository } from '../repositories/spaces.repository'
import { SpacesService } from './spaces.service'
import { stringify as uuidStringify } from 'uuid'
import { PublicSpaceDataResponseDto } from '@taaabs/shared'

const SpacesRepositoryMock = jest.fn<SpacesRepository, []>()

describe('SpacesService', () => {
  describe('getPublicSpaceData', () => {
    it('calls "publicCollectionsOnSpaceByUsername on repository"', () => {
      const spacesRepository = new SpacesRepositoryMock()
      spacesRepository.publicCollectionsOnSpaceByUsernameAndSpaceSlug = jest
        .fn()
        .mockReturnValue([])
      const sut = new SpacesService(spacesRepository)
      const username = 'username'
      const slug = 'slug'
      sut.getPublicSpaceData({ username, slug })
      expect(
        spacesRepository.publicCollectionsOnSpaceByUsernameAndSpaceSlug,
      ).toHaveBeenCalledWith({ username, slug })
    })

    it('parses returned from repository data correctly', async () => {
      const spacesRepository = new SpacesRepositoryMock()
      const repositoryReturnValue: Collection[] = [
        testPublicCollection,
        testPublicCollection,
      ]
      spacesRepository.publicCollectionsOnSpaceByUsernameAndSpaceSlug = jest.fn(
        async () => repositoryReturnValue,
      )
      const sut = new SpacesService(spacesRepository)
      const result = await sut.getPublicSpaceData({ username: '', slug: '' })
      const expectedResult: PublicSpaceDataResponseDto = {
        collections: repositoryReturnValue.map((collection) => ({
          id: uuidStringify(collection.id),
          name: collection.name,
          parentId: collection.parentId && uuidStringify(collection.parentId),
          updatedAt: collection.updatedAt.toISOString(),
        })),
      }
      expect(result).toStrictEqual(expectedResult)
    })
  })
})
