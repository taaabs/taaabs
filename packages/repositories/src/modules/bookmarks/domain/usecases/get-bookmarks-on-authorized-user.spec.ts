import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { GetBookmarksOnAuthorizedUser } from './get-bookmarks-on-authorized-user'

describe('GetBookmarksOnAuthorizedUser', () => {
  it('calls correct method on the repository', () => {
    const BookmarksRepositoryMock = jest.fn<BookmarksRepository, []>()
    const bookmarks_repository_mock = new BookmarksRepositoryMock()
    bookmarks_repository_mock.get_bookmarks_on_authorized_user = jest.fn()
    const sut = new GetBookmarksOnAuthorizedUser(bookmarks_repository_mock)
    sut.invoke({})
    expect(
      bookmarks_repository_mock.get_bookmarks_on_authorized_user,
    ).toHaveBeenCalled()
  })
})
