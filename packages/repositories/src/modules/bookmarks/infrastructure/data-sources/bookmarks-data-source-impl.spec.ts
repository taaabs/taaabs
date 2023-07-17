import { BookmarksDataSourceImpl } from './bookmarks-data-source-impl'

describe('BookmarksDataSourceImpl', () => {
  describe('getBookmarksOnAuthorizedUser', () => {
    it('should call proper endpoint via a GET request', () => {
      const sut = new BookmarksDataSourceImpl('http://example.com')
      sut.getBookmarksOnAuthorizedUser({})
      expect(fetch).toHaveBeenCalledWith('http://example.com/v1/bookmarks?')
    })
  })

  describe('getBookmarksOnPublicUser', () => {
    describe('query parameters are provided', () => {
      it('should provide stringified tags', () => {
        const sut = new BookmarksDataSourceImpl('http://example.com')
        const username = 'test'
        sut.getBookmarksOnPublicUser({
          username: username,
          tags: ['a', 'b', 'c'],
        })
        expect(fetch).toHaveBeenCalledWith(
          `http://example.com/v1/bookmarks/${username}?tags=${encodeURIComponent(
            'a,b,c',
          )}`,
        )
      })
    })
  })
})
