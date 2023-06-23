import { BookmarksDto } from '@shared/dtos/v1/bookmarks/bookmarks-on-user.dto'
import { BookmarksDataSource } from '../datasources/bookmarks-data-source'
import { BookmarksRo } from '../../domain/types/bookmarks.ro'
import { BookmarksRepositoryImpl } from './bookmarks-repository-impl'

const exampleDate = '2023-06-20T12:31:14.176Z'
const exampleUrl = 'https://example.com/test'

describe('BookmarksRepositoryImpl', () => {
  describe('getBookmarksOnCurrentUser', () => {
    it('should correctly parse dto', async () => {
      const dto: BookmarksDto.Response.OnCurrentUser = {
        bookmarks: [
          {
            id: '1',
            createdAt: exampleDate,
            saves: 1,
            title: 'test',
            url: exampleUrl,
          },
        ],
        pagination: {
          hasMore: false,
        },
      }
      const ro: BookmarksRo.OnCurrentUser = {
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
      const result = await sut.getBookmarksOnCurrentUser({ params: {} })
      expect(result).toStrictEqual(ro)
    })
  })

  describe('getBookmarksOnOtherUser', () => {
    it('should correclty parse dto', async () => {
      const dto: BookmarksDto.Response.OnOtherUser = {
        bookmarks: [
          {
            id: '1',
            createdAt: exampleDate,
            saves: 1,
            title: 'test',
            url: exampleUrl,
          },
        ],
        pagination: {
          hasMore: false,
        },
      }
      const ro: BookmarksRo.OnOtherUser = {
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
      const result = await sut.getBookmarksOnOtherUser({
        params: {},
        username: '',
      })
      expect(result).toStrictEqual(ro)
    })
  })
})
