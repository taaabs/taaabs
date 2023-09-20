import { Bookmarks_Repository } from '../repositories/bookmarks.repository'
import { GetBookmarksOnPublicUser_UseCase } from './get-bookmarks-on-public-user.use-case'

describe('GetBookmarksOnPublicUser_UseCase', () => {
  it('calls correct method on the repository', () => {
    const BookmarksRepositoryMock = jest.fn<Bookmarks_Repository, []>()
    const bookmarks_repository_mock = new BookmarksRepositoryMock()
    bookmarks_repository_mock.get_bookmarks_on_public_user = jest.fn()
    const sut = new GetBookmarksOnPublicUser_UseCase(bookmarks_repository_mock)
    sut.invoke({ username: 'test' })
    expect(
      bookmarks_repository_mock.get_bookmarks_on_public_user,
    ).toHaveBeenCalledWith({
      username: 'test',
    })
  })
})
