import { MetadataDataSourceImpl } from './metadata-data-source-impl'

describe('MetadataDataSourceImpl', () => {
  describe('getAuthorized', () => {
    it('should call proper endpoint via GET request', () => {
      const sut = new MetadataDataSourceImpl('http://example.com')
      sut.get_authorized()
      expect(fetch).toHaveBeenCalledWith('http://example.com/v1/metadata')
    })
  })

  describe('getPublic', () => {
    it('should call proper endpoint via GET request', () => {
      const sut = new MetadataDataSourceImpl('http://example.com')
      const username = 'test'
      sut.get_public({ username })
      expect(fetch).toHaveBeenCalledWith(
        `http://example.com/v1/metadata/${username}`,
      )
    })
  })
})
