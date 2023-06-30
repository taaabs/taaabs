import { AxiosInstance } from 'axios'
import { MockProxy, mock, mockReset } from 'jest-mock-extended'
import { MetadataDataSourceImpl } from './metadata-data-source-impl'

describe('MetadataDataSourceImpl', () => {
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
      const sut = new MetadataDataSourceImpl(axiosInstanceMock)
      sut.getAuthorized()
      expect(axiosInstanceMock.get).toHaveBeenCalledWith('/v1/metadata')
    })
  })

  describe('getPublic', () => {
    it('should call proper endpoint via GET request', () => {
      const sut = new MetadataDataSourceImpl(axiosInstanceMock)
      const username = 'test'
      sut.getPublic({ username })
      expect(axiosInstanceMock.get).toHaveBeenCalledWith(
        `/v1/metadata/${username}`,
      )
    })
  })
})
