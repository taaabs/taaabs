import { MetadataRepository } from '../repositories/metadata.repository'
import { GetPublicMetadata } from './get-public-metadata'

describe('GetPublicMetadata', () => {
  it('calls correct method on repository', () => {
    const MetadataRepositoryMock = jest.fn<MetadataRepository, []>()
    const metadataRepositoryMock = new MetadataRepositoryMock()
    metadataRepositoryMock.getPublic = jest.fn()
    const sut = new GetPublicMetadata(metadataRepositoryMock)
    const username = 'test'
    sut.invoke({ username })
    expect(metadataRepositoryMock.getPublic).toHaveBeenCalledWith({ username })
  })
})
