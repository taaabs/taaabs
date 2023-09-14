import { BookmarksDataSource } from '../data-sources/bookmarks-data-source'
import { BookmarksRo } from '../../domain/types/bookmarks.ro'
import { BookmarksRepositoryImpl } from './bookmarks-repository-impl'
import { BookmarksDto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { MockProxy, mock, mockReset } from 'jest-mock-extended'

const now = new Date().toISOString()

describe('BookmarksRepositoryImpl', () => {
  let bookmarks_data_source_mock: MockProxy<BookmarksDataSource>

  beforeAll(() => {
    bookmarks_data_source_mock = mock<BookmarksDataSource>()
  })

  beforeEach(() => {
    mockReset(bookmarks_data_source_mock)
  })

  describe('get_authorized', () => {
    it('should correctly parse dto', async () => {
      const dto: BookmarksDto.Response.Authorized = {
        bookmarks: [
          {
            id: '1',
            created_at: now,
            updated_at: now,
            title: 'test',
            links: [],
            tags: [],
          },
        ],
        pagination: {
          has_more: false,
        },
      }
      const ro: BookmarksRo.Authorized = {
        bookmarks: [
          {
            id: '1',
            created_at: now,
            updated_at: now,
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
      const sut = new BookmarksRepositoryImpl(bookmarks_data_source_mock)
      const result = await sut.get_bookmarks_on_authorized_user({})
      expect(result).toStrictEqual(ro)
    })
  })

  describe('get_public', () => {
    it('should correclty parse dto', async () => {
      const dto: BookmarksDto.Response.Public = {
        bookmarks: [
          {
            id: '1',
            created_at: now,
            updated_at: now,
            title: 'test',
            links: [],
            tags: [],
          },
        ],
        pagination: {
          has_more: false,
        },
      }
      const ro: BookmarksRo.Public = {
        bookmarks: [
          {
            id: '1',
            created_at: now,
            updated_at: now,
            is_nsfw: false,
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
      bookmarks_data_source_mock.get_bookmarks_on_public_user.mockResolvedValue(
        dto,
      )
      const sut = new BookmarksRepositoryImpl(bookmarks_data_source_mock)
      const result = await sut.get_bookmarks_on_public_user({
        username: '',
      })
      expect(result).toStrictEqual(ro)
    })
  })
})
