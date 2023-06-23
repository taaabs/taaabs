import { AxiosInstance } from 'axios'
import { BookmarksDataSourceImpl } from './bookmarks-data-source-impl'

describe('BookmarksDataSourceImpl', () => {
  describe('getBookmarksOnCurrentUser', () => {
    it('should call proper endpoint via GET request', () => {
      const MockAxiosInstance = jest.fn<AxiosInstance, []>()
      const mockAxiosInstance = new MockAxiosInstance()
      mockAxiosInstance.get = jest.fn(() => new Promise(() => null))
      const sut = new BookmarksDataSourceImpl(mockAxiosInstance)
      sut.getBookmarksOnCurrentUser({ params: {} })
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/bookmarks', {
        params: {},
      })
    })
  })

  describe('getBookmarksOnOtherUser', () => {
    it('should call proper endpoint via GET request', () => {
      const MockAxiosInstance = jest.fn<AxiosInstance, []>()
      const mockAxiosInstance = new MockAxiosInstance()
      mockAxiosInstance.get = jest.fn(() => new Promise(() => null))
      const sut = new BookmarksDataSourceImpl(mockAxiosInstance)
      const username = 'test_user'
      sut.getBookmarksOnOtherUser({ username, params: {} })
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        `/v1/bookmarks/${username}`,
        { params: {} },
      )
    })
  })
})
