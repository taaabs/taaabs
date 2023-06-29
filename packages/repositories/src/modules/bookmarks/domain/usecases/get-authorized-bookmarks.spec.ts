import { BookmarksRepository } from '../repositories/bookmarks.repository'
import { GetAuthorizedBookmarks } from './get-authorized-bookmarks'

describe('GetAuthorizedBookmarks', () => {
  it('calls correct method from repository', () => {
    const BookmarksRepositoryMock = jest.fn<BookmarksRepository, []>()
    const bookmarksRepositoryMock = new BookmarksRepositoryMock()
    bookmarksRepositoryMock.getAuthorized = jest.fn()
    const sut = new GetAuthorizedBookmarks(bookmarksRepositoryMock)
    sut.invoke({})
    expect(bookmarksRepositoryMock.getAuthorized).toHaveBeenCalled()
  })
})
