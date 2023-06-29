import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { GetPublicBookmarks } from './get-public-bookmarks'

describe('GetPublicBookmarks', () => {
  it('calls correct method from repository', () => {
    const BookmarksRepositoryMock = jest.fn<BookmarksRepository, []>()
    const bookmarksRepositoryMock = new BookmarksRepositoryMock()
    bookmarksRepositoryMock.getPublic = jest.fn()
    const sut = new GetPublicBookmarks(bookmarksRepositoryMock)
    sut.invoke({ username: 'test' })
    expect(bookmarksRepositoryMock.getPublic).toHaveBeenCalledWith({
      username: 'test',
    })
  })
})
