import { KyInstance } from 'ky'
import { Metadata_DataSourceImpl } from './metadata-data-source-impl'

describe('Metadata_DataSourceImpl', () => {
  let mock_ky: KyInstance
  let sut: Metadata_DataSourceImpl

  beforeEach(() => {
    mock_ky = {
      get: jest.fn().mockReturnValue({ json: jest.fn().mockResolvedValue({}) }),
    } as any
    sut = new Metadata_DataSourceImpl(mock_ky)
  })

  describe('[get_authorized]', () => {
    it('should call proper endpoint via GET request', () => {
      sut.get_authorized()
      expect(mock_ky.get).toHaveBeenCalledWith('v1/metadata')
    })
  })

  describe('[get_public]', () => {
    it('should call proper endpoint via GET request', () => {
      sut.get_public({ username: 'test' })
      expect(mock_ky.get).toHaveBeenCalledWith(`v1/metadata/test`)
    })
  })
})
