import { CollectionsService } from '../services/collections.service'
import { CollectionsController } from './collections.controller'

const CollectionsServiceMock = jest.fn<CollectionsService, []>()

describe('CollectionsController', () => {
  describe('getPublicCollectionData', () => {
    it('calls "getPublicCollectionData" on service', async () => {
      const collectionsService = new CollectionsServiceMock()
      collectionsService.getPublicCollectionData = jest
        .fn()
        .mockReturnValue('test')
      const sut = new CollectionsController(collectionsService)
      const id = 'test'
      const result = await sut.getPublicCollectionData(id)
      expect(collectionsService.getPublicCollectionData).toBeCalledWith({
        collectionId: id,
      })
      expect(result).toBe('test')
    })
  })
})
