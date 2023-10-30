import { MockProxy, mock, mockReset } from 'jest-mock-extended'
import { MetadataDataSource } from '../data-sources/metadata-data-source'
import { MetadataDto } from '@shared/types/modules/metadata/metadata.dto'
import { MetadataRo } from '../../domain/types/metadata.ro'
import { MetadataRepositoryImpl } from './metadata-repository-impl'

const now = new Date()

describe('MetadataRepositoryImpl', () => {
  let metadata_data_source_mock: MockProxy<MetadataDataSource>

  beforeAll(() => {
    metadata_data_source_mock = mock<MetadataDataSource>()
  })

  beforeEach(() => {
    mockReset(metadata_data_source_mock)
  })

  describe('[get_authorized]', () => {
    it('should correctly parse dto', async () => {
      const dto: MetadataDto.Response.Authorized = {
        username: 'test',
        is_email_confirmed: true,
        registered_at: now.toISOString(),
        display_name: 'Test',
      }
      const ro: MetadataRo.Authorized = {
        username: 'test',
        is_email_confirmed: true,
        registered_at: now,
        display_name: 'Test',
      }
      metadata_data_source_mock.get_authorized.mockResolvedValue(dto)
      const sut = new MetadataRepositoryImpl(metadata_data_source_mock)
      const result = await sut.get_authorized()
      expect(result).toEqual(ro)
    })
  })

  describe('[get_public]', () => {
    it('should correctly parse dto', async () => {
      const dto: MetadataDto.Response.Public = {
        username: 'test',
        display_name: 'Test',
        meta_description: 'Test test',
      }
      const ro: MetadataRo.Public = {
        avatar: undefined,
        username: 'test',
        display_name: 'Test',
        meta_description: 'Test test',
      }
      metadata_data_source_mock.get_public.mockResolvedValue(dto)
      const sut = new MetadataRepositoryImpl(metadata_data_source_mock)
      const result = await sut.get_public({ username: '' })
      expect(result).toStrictEqual(ro)
    })
  })
})
