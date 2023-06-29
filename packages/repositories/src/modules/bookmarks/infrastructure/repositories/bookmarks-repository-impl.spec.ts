import { BookmarksDataSource } from '../datasources/bookmarks-data-source'
import { BookmarksRo } from '../../domain/types/bookmarks.ro'
import { BookmarksRepositoryImpl } from './bookmarks-repository-impl'
import { BookmarksDto } from '@shared/dtos/modules/bookmarks/bookmarks.dto'

const exampleDate = '2023-06-20T12:31:14.176Z'
const exampleUrl = 'https://example.com/test'

describe('BookmarksRepositoryImpl', () => {
  describe('getBookmarksOnCurrentUser', () => {
    it('should correctly parse dto', async () => {
      const dto: BookmarksDto.Response.Authorized = {
        bookmarks: [
          {
            id: '1',
            created_at: exampleDate,
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
            createdAt: new Date(exampleDate),
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

      const MockBookmarksDataSource = jest.fn<BookmarksDataSource, []>()
      const mockBookmarksDataSource = new MockBookmarksDataSource()
      mockBookmarksDataSource.getBookmarksOnCurrentUser = jest.fn(
        () => new Promise((resolve) => resolve(dto)),
      )
      const sut = new BookmarksRepositoryImpl(mockBookmarksDataSource)
      const result = await sut.getAuthorizedBookmarks({ params: {} })
      expect(result).toStrictEqual(ro)
    })
  })

  describe('getBookmarksOnOtherUser', () => {
    it('should correclty parse dto', async () => {
      const dto: BookmarksDto.Response.Public = {
        bookmarks: [
          {
            id: '1',
            created_at: exampleDate,
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
            createdAt: new Date(exampleDate),
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

      const MockBookmarksDataSource = jest.fn<BookmarksDataSource, []>()
      const mockBookmarksDataSource = new MockBookmarksDataSource()
      mockBookmarksDataSource.getBookmarksOnOtherUser = jest.fn(
        () => new Promise((resolve) => resolve(dto)),
      )
      const sut = new BookmarksRepositoryImpl(mockBookmarksDataSource)
      const result = await sut.getPublicBookmarks({
        params: {},
        username: '',
      })
      expect(result).toStrictEqual(ro)
    })
  })
})
