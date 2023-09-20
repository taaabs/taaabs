import { Bookmarks_Repository } from '../repositories/bookmarks.repository'
import { GetBookmarksOnAuthorizedUser_UseCase } from './get-bookmarks-on-authorized-user.use-case'

describe('GetBookmarksOnAuthorizedUser_UseCase', () => {
  it('calls correct method on the repository', () => {
    const BookmarksRepositoryMock = jest.fn<Bookmarks_Repository, []>()
    const bookmarks_repository_mock = new BookmarksRepositoryMock()
    bookmarks_repository_mock.get_bookmarks_on_authorized_user = jest.fn()
    const sut = new GetBookmarksOnAuthorizedUser_UseCase(
      bookmarks_repository_mock,
    )
    sut.invoke({})
    expect(
      bookmarks_repository_mock.get_bookmarks_on_authorized_user,
    ).toHaveBeenCalled()
  })
})
