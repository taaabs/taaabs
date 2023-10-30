import { Bookmarks_DataSourceImpl } from './bookmarks.data-source-impl'

describe('Bookmarks_DataSourceImpl', () => {
  describe('[get_bookmarks_on_authorized_user]', () => {
    it('should call proper endpoint via a GET request', () => {
      const sut = new Bookmarks_DataSourceImpl('http://example.com', '123')
      sut.get_bookmarks_on_authorized_user({})
      expect(fetch).toHaveBeenCalledWith('http://example.com/v1/bookmarks?', {
        headers: { Authorization: 'Bearer 123' },
      })
    })
  })

  describe('get_bookmarks_on_public_user', () => {
    describe('query parameters are provided', () => {
      it('should provide stringified tags', () => {
        const sut = new Bookmarks_DataSourceImpl('http://example.com', '')
        const username = 'test'
        sut.get_bookmarks_on_public_user({
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
