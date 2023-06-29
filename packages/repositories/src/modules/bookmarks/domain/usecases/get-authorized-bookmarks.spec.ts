import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { GetAuthorizedBookmarks } from './get-authorized-bookmarks'

describe('GetBookmarksOnCurrentUser', () => {
  it('calls correct method from repository', () => {
    const BookmarksRepositoryMock = jest.fn<BookmarksRepository, []>()
    const bookmarksRepositoryMock = new BookmarksRepositoryMock()
    bookmarksRepositoryMock.getAuthorizedBookmarks = jest.fn()
    const sut = new GetAuthorizedBookmarks(bookmarksRepositoryMock)
    sut.invoke({})
    expect(bookmarksRepositoryMock.getAuthorizedBookmarks).toHaveBeenCalled()
  })
})
