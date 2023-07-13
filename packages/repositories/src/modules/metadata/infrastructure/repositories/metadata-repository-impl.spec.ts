import { MockProxy, mock, mockReset } from 'jest-mock-extended'
import { MetadataDataSource } from '../data-sources/metadata-data-source'
import { MetadataDto } from '@shared/types/modules/metadata/metadata.dto'
import { MetadataRo } from '../../domain/types/metadata.ro'
import { MetadataRepositoryImpl } from './metadata-repository-impl'

const now = new Date()

describe('MetadataRepositoryImpl', () => {
  let metadataDataSourceMock: MockProxy<MetadataDataSource>

  beforeAll(() => {
    metadataDataSourceMock = mock<MetadataDataSource>()
  })

  beforeEach(() => {
    mockReset(metadataDataSourceMock)
  })

  describe('getAuthorized', () => {
    it('should correctly parse dto', async () => {
      const dto: MetadataDto.Response.Authorized = {
        username: 'test',
        is_email_confirmed: true,
        registered_at: now.toISOString(),
        display_name: 'Test',
      }
      const ro: MetadataRo.Authorized = {
        username: 'test',
        isEmailConfirmed: true,
        registeredAt: now,
        displayName: 'Test',
        avatar: null,
      }
      metadataDataSourceMock.getAuthorized.mockResolvedValue(dto)
      const sut = new MetadataRepositoryImpl(metadataDataSourceMock)
      const result = await sut.getAuthorized()
      expect(result).toEqual(ro)
    })
  })

  describe('getPublic', () => {
    it('should correctly parse dto', async () => {
      const dto: MetadataDto.Response.Public = {
        username: 'test',
        display_name: 'Test',
        meta_description: 'Test test',
      }
      const ro: MetadataRo.Public = {
        username: 'test',
        displayName: 'Test',
        metaDescription: 'Test test',
        avatar: null,
      }
      metadataDataSourceMock.getPublic.mockResolvedValue(dto)
      const sut = new MetadataRepositoryImpl(metadataDataSourceMock)
      const result = await sut.getPublic({ username: '' })
      expect(result).toStrictEqual(ro)
    })
  })
})
