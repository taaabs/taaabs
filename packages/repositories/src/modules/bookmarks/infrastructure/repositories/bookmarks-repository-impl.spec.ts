import { BookmarksDataSource } from '../data-sources/bookmarks-data-source'
import { BookmarksRo } from '../../domain/types/bookmarks.ro'
import { BookmarksRepositoryImpl } from './bookmarks-repository-impl'
import { BookmarksDto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { MockProxy, mock, mockReset } from 'jest-mock-extended'

const now = new Date().toISOString()
const exampleUrl = 'https://example.com/test'

describe('BookmarksRepositoryImpl', () => {
  let bookmarksDataSourceMock: MockProxy<BookmarksDataSource>

  beforeAll(() => {
    bookmarksDataSourceMock = mock<BookmarksDataSource>()
  })

  beforeEach(() => {
    mockReset(bookmarksDataSourceMock)
  })

  describe('getAuthorized', () => {
    it('should correctly parse dto', async () => {
      const dto: BookmarksDto.Response.Authorized = {
        bookmarks: [
          {
            id: '1',
            created_at: now,
            saves: 1,
            title: 'test',
            url: exampleUrl,
          },
        ],
        pagination: {
          hasMore: false,
        },
      }
      const ro: BookmarksRo.Authorized = {
        bookmarks: [
          {
            id: '1',
            createdAt: now,
            isArchived: false,
            isNsfw: false,
            isPublic: false,
            isStarred: false,
            saves: 1,
            tags: [],
            title: 'test',
            url: exampleUrl,
            sitePath: null,
            text: null,
          },
        ],
        pagination: {
          hasMore: false,
        },
      }
      bookmarksDataSourceMock.getBookmarksOnAuthorizedUser.mockResolvedValue(dto)
      const sut = new BookmarksRepositoryImpl(bookmarksDataSourceMock)
      const result = await sut.getBookmarksOnAuthorizedUser({})
      expect(result).toStrictEqual(ro)
    })
  })

  describe('getPublic', () => {
    it('should correclty parse dto', async () => {
      const dto: BookmarksDto.Response.Public = {
        bookmarks: [
          {
            id: '1',
            created_at: now,
            saves: 1,
            title: 'test',
            url: exampleUrl,
          },
        ],
        pagination: {
          hasMore: false,
        },
      }
      const ro: BookmarksRo.Public = {
        bookmarks: [
          {
            id: '1',
            createdAt: now,
            isArchived: false,
            isNsfw: false,
            isStarred: false,
            saves: 1,
            tags: [],
            title: 'test',
            url: exampleUrl,
            sitePath: null,
            text: null,
          },
        ],
        pagination: {
          hasMore: false,
        },
      }
      bookmarksDataSourceMock.getBookmarksOnPublicUser.mockResolvedValue(dto)
      const sut = new BookmarksRepositoryImpl(bookmarksDataSourceMock)
      const result = await sut.getBookmarksOnPublicUser({
        username: '',
      })
      expect(result).toStrictEqual(ro)
    })
  })
})
