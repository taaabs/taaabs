import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { GetBookmarksOnOtherUser } from './get-bookmarks-on-other-user'

describe('GetBookmarksOnOtherUser', () => {
  it('calls correct method from repository', () => {
    const BookmarksRepositoryMock = jest.fn<BookmarksRepository, []>()
    const bookmarksRepositoryMock = new BookmarksRepositoryMock()
    bookmarksRepositoryMock.getBookmarksOnOtherUser = jest.fn()
    const sut = new GetBookmarksOnOtherUser(bookmarksRepositoryMock)
    sut.invoke({ username: '' })
    expect(bookmarksRepositoryMock.getBookmarksOnOtherUser).toHaveBeenCalled()
  })
})
