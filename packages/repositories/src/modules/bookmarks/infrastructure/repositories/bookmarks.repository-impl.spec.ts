import { Bookmarks_DataSource } from '../data-sources/bookmarks.data-source'
import { Bookmarks_Ro } from '../../domain/types/bookmarks.ro'
import { Bookmarks_RepositoryImpl } from './bookmarks.repository-impl'
import { Bookmarks_Dto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { MockProxy, mock, mockReset } from 'jest-mock-extended'

const now = new Date().toISOString()

describe('Bookmarks_RepositoryImpl', () => {
  let bookmarks_data_source_mock: MockProxy<Bookmarks_DataSource>

  beforeAll(() => {
    bookmarks_data_source_mock = mock<Bookmarks_DataSource>()
  })

  beforeEach(() => {
    mockReset(bookmarks_data_source_mock)
  })

  describe('[get_authorized]', () => {
    it('should correctly parse dto', async () => {
      const dto: Bookmarks_Dto.Response.Authorized = {
        bookmarks: [
          {
            id: '1',
            created_at: now,
            updated_at: now,
            visited_at: now,
            title: 'test',
            links: [],
            tags: [],
          },
        ],
        pagination: {
          has_more: false,
        },
      }
      const ro: Bookmarks_Ro = {
        bookmarks: [
          {
            id: '1',
            created_at: now,
            updated_at: now,
            visited_at: now,
            is_nsfw: false,
            is_public: false,
            is_starred: false,
            title: 'test',
            note: undefined,
            tags: [],
            links: [],
          },
        ],
        pagination: {
          has_more: false,
        },
      }
      bookmarks_data_source_mock.get_bookmarks_on_authorized_user.mockResolvedValue(
        dto,
      )
      const sut = new Bookmarks_RepositoryImpl(bookmarks_data_source_mock)
      const result = await sut.get_bookmarks_on_authorized_user({})
      expect(result).toStrictEqual(ro)
    })
  })

  describe('[get_public]', () => {
    it('should correclty parse dto', async () => {
      const dto: Bookmarks_Dto.Response.Public = {
        bookmarks: [
          {
            id: '1',
            created_at: now,
            updated_at: now,
            visited_at: now,
            title: 'test',
            links: [],
            tags: [],
          },
        ],
        pagination: {
          has_more: false,
        },
      }
      const ro: Bookmarks_Ro = {
        bookmarks: [
          {
            id: '1',
            created_at: now,
            updated_at: now,
            visited_at: now,
            is_nsfw: false,
            is_starred: false,
            is_public: true,
            title: 'test',
            note: undefined,
            tags: [],
            links: [],
          },
        ],
        pagination: {
          has_more: false,
        },
      }
      bookmarks_data_source_mock.get_bookmarks_on_public_user.mockResolvedValue(
        dto,
      )
      const sut = new Bookmarks_RepositoryImpl(bookmarks_data_source_mock)
      const result = await sut.get_bookmarks_on_public_user({
        username: '',
      })
      expect(result).toStrictEqual(ro)
    })
  })
})
