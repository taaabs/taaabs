import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { GetBookmarksOnPublicUser } from './get-bookmarks-on-public-user'

describe('GetBookmarksOnPublicUser', () => {
  it('calls correct method on the repository', () => {
    const BookmarksRepositoryMock = jest.fn<BookmarksRepository, []>()
    const bookmarksRepositoryMock = new BookmarksRepositoryMock()
    bookmarksRepositoryMock.getBookmarksOnPublicUser = jest.fn()
    const sut = new GetBookmarksOnPublicUser(bookmarksRepositoryMock)
    sut.invoke({ username: 'test' })
    expect(
      bookmarksRepositoryMock.getBookmarksOnPublicUser,
    ).toHaveBeenCalledWith({
      username: 'test',
    })
  })
})
