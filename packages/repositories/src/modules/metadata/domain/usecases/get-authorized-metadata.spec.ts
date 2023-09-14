import { MetadataRepository } from '../repositories/metadata.repository'
import { GetAuthorizedMetadata } from './get-authorized-metadata'

describe('GetAuthorizedMetadata', () => {
  it('calls correct method on repository', () => {
    const MetadataRepositoryMock = jest.fn<MetadataRepository, []>()
    const metadataRepositoryMock = new MetadataRepositoryMock()
    metadataRepositoryMock.get_authorized = jest.fn()
    const sut = new GetAuthorizedMetadata(metadataRepositoryMock)
    sut.invoke()
    expect(metadataRepositoryMock.get_authorized).toHaveBeenCalled()
  })
})
