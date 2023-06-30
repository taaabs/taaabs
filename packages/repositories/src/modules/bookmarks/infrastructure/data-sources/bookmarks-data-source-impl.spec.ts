import { AxiosInstance } from 'axios'
import { BookmarksDataSourceImpl } from './bookmarks-data-source-impl'
import { MockProxy, mock, mockReset } from 'jest-mock-extended'

describe('BookmarksDataSourceImpl', () => {
  let axiosInstanceMock: MockProxy<AxiosInstance>

  beforeAll(() => {
    axiosInstanceMock = mock<AxiosInstance>()
  })

  beforeEach(() => {
    mockReset(axiosInstanceMock)
    axiosInstanceMock.get.mockResolvedValue({ data: {} })
  })

  describe('getAuthorized', () => {
    it('should call proper endpoint via GET request', () => {
      const sut = new BookmarksDataSourceImpl(axiosInstanceMock)
      sut.getAuthorized({})
      expect(axiosInstanceMock.get).toHaveBeenCalledWith('/v1/bookmarks', {
        params: {},
      })
    })
  })

  describe('getPublic', () => {
    describe('query parameters are provided', () => {
      it('passes stringified tags', () => {
        const sut = new BookmarksDataSourceImpl(axiosInstanceMock)
        const username = 'test'
        sut.getPublic({ username: username, tags: ['a', 'b', 'c'] })
        expect(axiosInstanceMock.get).toHaveBeenCalledWith(
          `/v1/bookmarks/${username}`,
          { params: { tags: 'a,b,c' } },
        )
      })
    })
  })
})
