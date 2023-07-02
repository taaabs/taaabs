import { MetadataDataSourceImpl } from './metadata-data-source-impl'

describe('MetadataDataSourceImpl', () => {
  describe('getAuthorized', () => {
    it('should call proper endpoint via GET request', () => {
      const sut = new MetadataDataSourceImpl(fetch, 'http://example.com')
      sut.getAuthorized()
      expect(fetch).toHaveBeenCalledWith('http://example.com/v1/metadata')
    })
  })

  describe('getPublic', () => {
    it('should call proper endpoint via GET request', () => {
      const sut = new MetadataDataSourceImpl(fetch, 'http://example.com')
      const username = 'test'
      sut.getPublic({ username })
      expect(fetch).toHaveBeenCalledWith(
        `http://example.com/v1/metadata/${username}`,
      )
    })
  })
})
