import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { GetPublicBookmarks } from './get-public-bookmarks'

describe('GetBookmarksOnOtherUser', () => {
  it('calls correct method from repository', () => {
    const BookmarksRepositoryMock = jest.fn<BookmarksRepository, []>()
    const bookmarksRepositoryMock = new BookmarksRepositoryMock()
    bookmarksRepositoryMock.getPublicBookmarks = jest.fn()
    const sut = new GetPublicBookmarks(bookmarksRepositoryMock)
    sut.invoke({ username: '' })
    expect(bookmarksRepositoryMock.getPublicBookmarks).toHaveBeenCalled()
  })
})
