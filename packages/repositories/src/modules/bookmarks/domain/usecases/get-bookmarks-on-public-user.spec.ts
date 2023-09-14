import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { GetBookmarksOnPublicUser } from './get-bookmarks-on-public-user'

describe('GetBookmarksOnPublicUser', () => {
  it('calls correct method on the repository', () => {
    const BookmarksRepositoryMock = jest.fn<BookmarksRepository, []>()
    const bookmarks_repository_mock = new BookmarksRepositoryMock()
    bookmarks_repository_mock.get_bookmarks_on_public_user = jest.fn()
    const sut = new GetBookmarksOnPublicUser(bookmarks_repository_mock)
    sut.invoke({ username: 'test' })
    expect(
      bookmarks_repository_mock.get_bookmarks_on_public_user,
    ).toHaveBeenCalledWith({
      username: 'test',
    })
  })
})
