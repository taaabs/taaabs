import { RecordVisit_Dto } from '@shared/types/modules/bookmarks/record-visit.dto'
import { Bookmarks_DataSourceImpl } from './bookmarks.data-source-impl'
import { FindByUrlHash_Params } from '../../domain/types/find-by-url-hash.params'
import { ky_instance_mock } from '@repositories/mocks/ky-instance-mock'
import { GetCover_Params } from '../../domain/types/get-cover.params'
import { DeleteBookmarkByUrlHash_Params } from '../../domain/types/delete-bookmark-by-url-hash.params'

describe('Bookmarks_DataSourceImpl', () => {
  let sut: Bookmarks_DataSourceImpl

  beforeEach(() => {
    sut = new Bookmarks_DataSourceImpl(ky_instance_mock)
    jest.clearAllMocks()
  })

  describe('[get_bookmarks_on_authorized_user]', () => {
    it('calls api correctly', () => {
      sut.get_bookmarks_on_authorized_user({})
      expect(ky_instance_mock.get).toHaveBeenCalledWith('v1/bookmarks', {
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
      expect(ky_instance_mock.get).toHaveBeenCalledWith(`v1/bookmarks/test`, {
        searchParams: {
          tags: 'a,b,c',
        },
      })
    })
  })

  describe('[get_cover]', () => {
    it('calls api correctly', async () => {
      const params: GetCover_Params = {
        bookmark_id: 123,
        bookmark_updated_at: '2023-10-01T00:00:00Z',
      }

      const search_params = new URLSearchParams()
      search_params.set(
        'v',
        `${Math.floor(new Date(params.bookmark_updated_at).getTime() / 1000)}`,
      )

      await sut.get_cover(params)

      expect(ky_instance_mock.get).toHaveBeenCalledWith(
        `v1/bookmarks/${params.bookmark_id}/cover`,
        {
          searchParams: search_params,
        },
      )
    })
  })

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
      expect(ky_instance_mock.post).toHaveBeenCalledWith(
        `v1/bookmarks/record-visit`,
        {
          json: body,
        },
      )
    })
  })

  describe('[delete_bookmark]', () => {
    it('calls api correctly', () => {
      sut.delete_bookmark({ bookmark_id: 1 })
      expect(ky_instance_mock.delete).toHaveBeenCalledWith(`v1/bookmarks/1`)
    })
  })

  describe('[find_by_url_hash]', () => {
    it('calls API correctly', async () => {
      const params: FindByUrlHash_Params = { url: '' }

      await sut.find_by_url_hash(params, new Uint8Array())

      expect(ky_instance_mock.get).toHaveBeenCalledWith(
        'v1/bookmarks/find-by-url-hash/mocked_hash',
      )
    })
  })

  describe('[delete_bookmark_by_url_hash]', () => {
    it('calls API correctly', async () => {
      const params: DeleteBookmarkByUrlHash_Params = { hash: 'test_hash' };

      await sut.delete_bookmark_by_url_hash(params, new Uint8Array());

      expect(ky_instance_mock.delete).toHaveBeenCalledWith(`v1/bookmarks/delete-by-url-hash/mocked_hash`);
    });
  });
})
