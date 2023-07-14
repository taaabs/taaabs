import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { GetBookmarksOnOtherUser } from './get-bookmarks-on-other-user'

describe('GetPublicBookmarks', () => {
  it('calls correct method on the repository', () => {
    const BookmarksRepositoryMock = jest.fn<BookmarksRepository, []>()
    const bookmarksRepositoryMock = new BookmarksRepositoryMock()
    bookmarksRepositoryMock.getBookmarksOnOtherUser = jest.fn()
    const sut = new GetBookmarksOnOtherUser(bookmarksRepositoryMock)
    sut.invoke({ username: 'test' })
    expect(
      bookmarksRepositoryMock.getBookmarksOnOtherUser,
    ).toHaveBeenCalledWith({
      username: 'test',
    })
  })
})
