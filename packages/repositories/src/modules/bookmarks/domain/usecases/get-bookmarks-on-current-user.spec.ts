import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { GetBookmarksOnCurrentUser } from './get-bookmarks-on-current-user'

describe('GetBookmarksOnCurrentUser', () => {
  it('calls correct method from repository', () => {
    const BookmarksRepositoryMock = jest.fn<BookmarksRepository, []>()
    const bookmarksRepositoryMock = new BookmarksRepositoryMock()
    bookmarksRepositoryMock.getAuthorizedBookmarks = jest.fn()
    const sut = new GetBookmarksOnCurrentUser(bookmarksRepositoryMock)
    sut.invoke({})
    expect(bookmarksRepositoryMock.getAuthorizedBookmarks).toHaveBeenCalled()
  })
})
