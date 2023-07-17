import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { GetBookmarksOnAuthorizedUser } from './get-bookmarks-on-authorized-user'

describe('GetBookmarksOnAuthorizedUser', () => {
  it('calls correct method on the repository', () => {
    const BookmarksRepositoryMock = jest.fn<BookmarksRepository, []>()
    const bookmarksRepositoryMock = new BookmarksRepositoryMock()
    bookmarksRepositoryMock.getBookmarksOnAuthorizedUser = jest.fn()
    const sut = new GetBookmarksOnAuthorizedUser(bookmarksRepositoryMock)
    sut.invoke({})
    expect(
      bookmarksRepositoryMock.getBookmarksOnAuthorizedUser,
    ).toHaveBeenCalled()
  })
})
