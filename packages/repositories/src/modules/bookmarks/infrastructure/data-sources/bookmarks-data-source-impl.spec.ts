import { BookmarksDataSourceImpl } from './bookmarks-data-source-impl'

describe('BookmarksDataSourceImpl', () => {
  describe('getAuthorized', () => {
    it('should call proper endpoint via GET request', () => {
      const sut = new BookmarksDataSourceImpl('http://example.com')
      sut.getAuthorized({})
      expect(fetch).toHaveBeenCalledWith('http://example.com/v1/bookmarks', {
        params: {},
      })
    })
  })

  describe('getPublic', () => {
    describe('query parameters are provided', () => {
      it('passes stringified tags', () => {
        const sut = new BookmarksDataSourceImpl('http://example.com')
        const username = 'test'
        sut.getPublic({ username: username, tags: ['a', 'b', 'c'] })
        expect(fetch).toHaveBeenCalledWith(
          `http://example.com/v1/bookmarks/${username}`,
          { params: { tags: 'a,b,c' } },
        )
      })
    })
  })
})
