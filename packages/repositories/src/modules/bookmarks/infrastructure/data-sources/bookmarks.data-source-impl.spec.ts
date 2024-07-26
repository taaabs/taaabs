import { RecordVisit_Dto } from '@shared/types/modules/bookmarks/record-visit.dto'
import { Bookmarks_DataSourceImpl } from './bookmarks.data-source-impl'
import { KyInstance } from 'ky'
import { FindDuplicate_Params } from '../../domain/types/find-duplicate.params'
import { FindDuplicate_Dto } from '@shared/types/modules/bookmarks/find-duplicate.dto'

describe('Bookmarks_DataSourceImpl', () => {
  let mock_ky: KyInstance
  let sut: Bookmarks_DataSourceImpl

  beforeEach(() => {
    mock_ky = {
      get: jest.fn().mockReturnValue({ json: jest.fn().mockResolvedValue({}) }),
      post: jest
        .fn()
        .mockReturnValue({ json: jest.fn().mockResolvedValue({}) }),
      delete: jest
        .fn()
        .mockReturnValue({ json: jest.fn().mockResolvedValue({}) }),
    } as any
    sut = new Bookmarks_DataSourceImpl(mock_ky)
  })

  describe('[get_bookmarks_on_authorized_user]', () => {
    it('calls api correctly', () => {
      sut.get_bookmarks_on_authorized_user({})
      expect(mock_ky.get).toHaveBeenCalledWith('v1/bookmarks', {
        searchParams: {},
      })
    })
  })

  describe('[get_bookmarks_on_public_user]', () => {
    it('calls api correctly', () => {
      sut.get_bookmarks_on_public_user({
        username: 'test',
        tags: ['a', 'b', 'c'],
      })
      expect(mock_ky.get).toHaveBeenCalledWith(`v1/bookmarks/test`, {
        searchParams: {
          tags: 'a,b,c',
        },
      })
    })
  })

  // TODO: Test get_cover.

  describe('[record_visit]', () => {
    it('calls api correctly', () => {
      const body: RecordVisit_Dto.Body = {
        bookmark_id: 1,
        visited_at: new Date().toISOString(),
      }
      sut.record_visit({
        bookmark_id: body.bookmark_id,
        visited_at: new Date(body.visited_at).toISOString(),
      })
      expect(mock_ky.post).toHaveBeenCalledWith(`v1/bookmarks/record-visit`, {
        json: body,
      })
    })
  })

  describe('[delete_bookmark]', () => {
    it('calls api correctly', () => {
      sut.delete_bookmark({ bookmark_id: 1 })
      expect(mock_ky.delete).toHaveBeenCalledWith(`v1/bookmarks/1`)
    })
  })
})
