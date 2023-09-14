import { MetadataRepository } from '../repositories/metadata.repository'
import { GetPublicMetadata } from './get-public-metadata'

describe('GetPublicMetadata', () => {
  it('calls correct method on repository', () => {
    const MetadataRepositoryMock = jest.fn<MetadataRepository, []>()
    const metadata_repository_mock = new MetadataRepositoryMock()
    metadata_repository_mock.get_public = jest.fn()
    const sut = new GetPublicMetadata(metadata_repository_mock)
    const username = 'test'
    sut.invoke({ username })
    expect(metadata_repository_mock.get_public).toHaveBeenCalledWith({
      username,
    })
  })
})
