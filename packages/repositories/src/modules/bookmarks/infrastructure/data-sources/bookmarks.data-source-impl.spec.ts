import { Bookmarks_DataSourceImpl } from './bookmarks.data-source-impl'

describe('Bookmarks_DataSourceImpl', () => {
  describe('[get_bookmarks_on_authorized_user]', () => {
    it('calls fetch correctly', () => {
      const sut = new Bookmarks_DataSourceImpl('http://example.com', 'token')
      sut.get_bookmarks_on_authorized_user({})
      expect(fetch).toHaveBeenCalledWith('http://example.com/v1/bookmarks?', {
        headers: { Authorization: 'Bearer token' },
      })
    })
  })

  describe('[get_bookmarks_on_public_user]', () => {
    describe('query parameters are provided', () => {
      it('calls fetch correctly', () => {
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

  describe('[record_visit]', () => {
    it('calls fetch correctly', () => {
      const sut = new Bookmarks_DataSourceImpl('http://example.com', 'token')
      sut.record_visit({ bookmark_id: 'test' })
      expect(fetch).toHaveBeenCalledWith(
        `http://example.com/v1/bookmarks/test/record-visit`,
        {
          headers: { Authorization: 'Bearer token' },
        },
      )
    })
  })

  describe('[delete_bookmark]', () => {
    it('calls fetch correctly', () => {
      const sut = new Bookmarks_DataSourceImpl('http://example.com', 'token')
      sut.delete_bookmark({ bookmark_id: 'test' })
      expect(fetch).toHaveBeenCalledWith(
        `http://example.com/v1/bookmarks/test`,
        {
          method: 'DELETE',
          headers: { Authorization: 'Bearer token' },
        },
      )
    })
  })
})
