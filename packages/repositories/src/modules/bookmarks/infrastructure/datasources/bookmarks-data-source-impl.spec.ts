import { AxiosInstance } from 'axios'
import { BookmarksDataSourceImpl } from './bookmarks-data-source-impl'

describe('BookmarksDataSourceImpl', () => {
  describe('getAuthorized', () => {
    it('should call proper endpoint via GET request', () => {
      const MockAxiosInstance = jest.fn<AxiosInstance, []>()
      const mockAxiosInstance = new MockAxiosInstance()
      mockAxiosInstance.get = jest.fn(() => new Promise(() => null))
      const sut = new BookmarksDataSourceImpl(mockAxiosInstance)
      sut.getAuthorized({})
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/bookmarks', {
        params: {},
      })
    })
  })

  describe('getPublic', () => {
    describe('query parameters are provided', () => {
      it('passes stringified tags', () => {
        const MockAxiosInstance = jest.fn<AxiosInstance, []>()
        const mockAxiosInstance = new MockAxiosInstance()
        mockAxiosInstance.get = jest.fn(() => new Promise(() => null))
        const sut = new BookmarksDataSourceImpl(mockAxiosInstance)
        const username = 'test'
        sut.getPublic({ username: username, tags: ['a', 'b', 'c'] })
        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          `/v1/bookmarks/${username}`,
          { params: { tags: 'a,b,c' } },
        )
      })
    })
  })
})
