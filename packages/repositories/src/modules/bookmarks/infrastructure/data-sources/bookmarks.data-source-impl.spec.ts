import { RecordVisit_Dto } from '@shared/types/modules/bookmarks/record-visit.dto'
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
      const body: RecordVisit_Dto.Body = {
        bookmark_id: 1,
        visited_at: new Date().toISOString(),
      }
      sut.record_visit({
        bookmark_id: body.bookmark_id,
        visited_at: new Date(body.visited_at),
      })
      expect(fetch).toHaveBeenCalledWith(
        `http://example.com/v1/bookmarks/record-visit`,
        {
          headers: {
            Authorization: 'Bearer token',
            ['Content-Type']: 'application/json',
          },
          method: 'POST',
          json: body,
        },
      )
    })
  })

  describe('[delete_bookmark]', () => {
    it('calls fetch correctly', () => {
      const sut = new Bookmarks_DataSourceImpl('http://example.com', 'token')
      sut.delete_bookmark({ bookmark_id: 1 })
      expect(fetch).toHaveBeenCalledWith(`http://example.com/v1/bookmarks/1`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer token' },
      })
    })
  })
})
