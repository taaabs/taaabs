import { Bookmarks_RepositoryImpl } from './bookmarks.repository-impl'
import { AES } from '@repositories/utils/aes'
import pako from 'pako'
import { Bookmarks_DataSource } from '../data-sources/bookmarks.data-source'
import { Bookmarks_Dto } from '@shared/types/modules/bookmarks/bookmarks.dto'
import { LinksData_Dto } from '@shared/types/modules/bookmarks/links-data.dto'
import { GetCover_Params } from '../../domain/types/get-cover.params'
import { RecordVisit_Params } from '../../domain/types/record-visit.params'
import { FindByUrlHash_Params } from '../../domain/types/find-by-url-hash.params'
import { FindByUrlHash_Dto } from '@shared/types/modules/bookmarks/find-by-url-hash.dto'
import { UpsertBookmark_Params } from '../../domain/types/upsert-bookmark.params'
import { DeleteBookmarkByUrlHash_Params } from '../../domain/types/delete-bookmark-by-url-hash.params'

declare const global: any

describe('Bookmarks_RepositoryImpl', () => {
  let data_source_mock: jest.Mocked<Bookmarks_DataSource>
  let sut: Bookmarks_RepositoryImpl
  const encryption_key = new Uint8Array([1, 2, 3])

  beforeEach(() => {
    data_source_mock = {
      get_bookmarks_on_authorized_user: jest.fn(),
      get_bookmarks_on_public_user: jest.fn(),
      get_bookmarks_by_ids_authorized: jest.fn(),
      get_bookmarks_by_ids_public: jest.fn(),
      get_links_data_authorized: jest.fn(),
      get_links_data_public: jest.fn(),
      upsert_bookmark: jest.fn(),
      delete_bookmark: jest.fn(),
      get_cover: jest.fn(),
      record_visit: jest.fn(),
      find_by_url_hash: jest.fn(),
      delete_bookmark_by_url_hash: jest.fn(),
    } as jest.Mocked<Bookmarks_DataSource>
    sut = new Bookmarks_RepositoryImpl(data_source_mock)

    // Mock TextDecoder
    global.TextDecoder = jest.fn().mockImplementation(() => ({
      decode: jest.fn().mockReturnValue('hello'),
    })) as any

    // Mock atob
    global.atob = jest.fn().mockImplementation((encoded) => {
      if (encoded === 'invalid_base64') {
        throw new Error('Invalid base64')
      }
      return 'valid_base64_decoded'
    })
  })

  describe('[get_bookmarks_on_authorized_user]', () => {
    it('should call data source and return correct result', async () => {
      const params = { userId: 'user1' } as any
      const dto_mock = {
        bookmarks: [
          {
            id: 1,
            title_aes: 'encrypted_title',
            tags: [{ id: 1, name_aes: 'encrypted_tag' }],
            links: [{ url_aes: 'encrypted_url', site_aes: 'encrypted_site' }],
          },
        ],
      } as Bookmarks_Dto.Response.Authorized

      data_source_mock.get_bookmarks_on_authorized_user.mockResolvedValue(
        dto_mock,
      )
      jest.spyOn(AES, 'decrypt').mockResolvedValue('decrypted')

      const result = await sut.get_bookmarks_on_authorized_user(
        params,
        encryption_key,
      )

      expect(
        data_source_mock.get_bookmarks_on_authorized_user,
      ).toHaveBeenCalledWith(params)
      expect(result.bookmarks?.[0].title).toBe('decrypted')
      expect(result.bookmarks?.[0].tags[0].name).toBe('decrypted')
      expect(result.bookmarks?.[0].links[0].url).toBe('decrypted')
    })
  })

  describe('[get_bookmarks_on_public_user]', () => {
    it('should call data source and return correct result', async () => {
      const params = { userId: 'user1' } as any
      const dto_mock = {
        bookmarks: [
          {
            id: 1,
            title: 'title',
            tags: [{ id: 1, name: 'tag' }],
            links: [{ url: 'url', site_path: 'site' }],
          },
        ],
      } as Bookmarks_Dto.Response.Public

      data_source_mock.get_bookmarks_on_public_user.mockResolvedValue(dto_mock)

      const result = await sut.get_bookmarks_on_public_user(params)

      expect(
        data_source_mock.get_bookmarks_on_public_user,
      ).toHaveBeenCalledWith(params)
      expect(result.bookmarks?.[0].title).toBe('title')
      expect(result.bookmarks?.[0].tags[0].name).toBe('tag')
      expect(result.bookmarks?.[0].links[0].url).toBe('url')
      expect(result.bookmarks?.[0].links[0].site_path).toBe('site')
    })
  })

  describe('[get_bookmarks_by_ids_authorized]', () => {
    it('should call data source and return correct result', async () => {
      const params = { ids: [1] } as any
      const dto_mock = {
        bookmarks: [
          {
            id: 1,
            title_aes: 'encrypted title',
            tags: [{ id: 1, name_aes: 'encrypted tag' }],
            links: [{ url_aes: 'encrypted url' }],
          },
        ],
      } as Bookmarks_Dto.Response.Authorized

      data_source_mock.get_bookmarks_by_ids_authorized.mockResolvedValue(
        dto_mock,
      )
      jest.spyOn(AES, 'decrypt').mockResolvedValue('decrypted')

      const result = await sut.get_bookmarks_by_ids_authorized(
        params,
        encryption_key,
      )

      expect(
        data_source_mock.get_bookmarks_by_ids_authorized,
      ).toHaveBeenCalledWith(params)
      expect(result.bookmarks?.[0].title).toBe('decrypted')
      expect(result.bookmarks?.[0].tags[0].name).toBe('decrypted')
      expect(result.bookmarks?.[0].links[0].url).toBe('decrypted')
    })
  })

  describe('[get_bookmarks_by_ids_public]', () => {
    it('should call data source and return correct result', async () => {
      const params = { ids: [1] } as any
      const dto_mock = {
        bookmarks: [
          {
            id: 1,
            title: 'public title',
            tags: [{ id: 1, name: 'public tag' }],
            links: [{ url: 'public url', site_path: 'public site' }],
          },
        ],
      } as Bookmarks_Dto.Response.Public

      data_source_mock.get_bookmarks_by_ids_public.mockResolvedValue(dto_mock)

      const result = await sut.get_bookmarks_by_ids_public(params)

      expect(data_source_mock.get_bookmarks_by_ids_public).toHaveBeenCalledWith(
        params,
      )
      expect(result.bookmarks?.[0].title).toBe('public title')
      expect(result.bookmarks?.[0].tags[0].name).toBe('public tag')
      expect(result.bookmarks?.[0].links[0].url).toBe('public url')
      expect(result.bookmarks?.[0].links[0].site_path).toBe('public site')
    })
  })

  describe('[get_links_data_authorized]', () => {
    it('should call data source and return correct result', async () => {
      const params = { urls: ['https://example.com'] } as any
      const dto_mock = [
        {
          url_aes: 'encrypted url',
          reader_data_aes: 'encrypted reader data',
        },
      ] as LinksData_Dto.Response.Authorized

      data_source_mock.get_links_data_authorized.mockResolvedValue(dto_mock)
      jest.spyOn(AES, 'decrypt').mockResolvedValue('decrypted')
      jest
        .spyOn(pako, 'inflate')
        .mockReturnValue(new Uint8Array([104, 101, 108, 108, 111]))

      const result = await sut.get_links_data_authorized(params, encryption_key)

      expect(data_source_mock.get_links_data_authorized).toHaveBeenCalledWith(
        params,
      )
      expect(result[0].url).toBe('decrypted')
      expect(result[0].reader_data).toBe('hello')
    })
  })

  describe('[get_links_data_public]', () => {
    it('should call data source and return correct result', async () => {
      const params = { urls: ['https://example.com'] } as any
      const dto_mock: LinksData_Dto.Response.Public = [
        {
          url: 'public url',
          reader_data: 'public reader data',
        },
      ]

      data_source_mock.get_links_data_public.mockResolvedValue(dto_mock)

      const result = await sut.get_links_data_public(params)

      expect(data_source_mock.get_links_data_public).toHaveBeenCalledWith(
        params,
      )
      expect(result[0].url).toBe('public url')
      expect(result[0].reader_data).toBe('public reader data')
    })
  })

  describe('[upsert_bookmark]', () => {
    it('should call data source and return correct result', async () => {
      const params: UpsertBookmark_Params = {
        is_public: true,
        tags: [{ name: 'tag1' }],
        links: [{ url: 'url1', is_public: false }],
        is_archived: false,
      }
      const dto_mock = {
        id: 1,
        title_aes: 'encrypted_title',
        tags: [{ id: 1, name_aes: 'encrypted_tag' }],
        links: [{ url_aes: 'encrypted_url', site_aes: 'encrypted_site' }],
      } as Bookmarks_Dto.Response.AuthorizedBookmark

      data_source_mock.upsert_bookmark.mockResolvedValue(dto_mock)
      jest.spyOn(AES, 'decrypt').mockResolvedValue('decrypted')

      const result = await sut.upsert_bookmark(params, encryption_key)

      expect(data_source_mock.upsert_bookmark).toHaveBeenCalledWith(
        params,
        encryption_key,
      )
      expect(result.title).toBe('decrypted')
      expect(result.tags[0].name).toBe('decrypted')
      expect(result.links[0].url).toBe('decrypted')
    })
  })

  describe('[delete_bookmark]', () => {
    it('should call data source', async () => {
      const params = { bookmark_id: 1 } as any

      await sut.delete_bookmark(params)

      expect(data_source_mock.delete_bookmark).toHaveBeenCalledWith(params)
    })
  })

  describe('[get_cover]', () => {
    it('should call data source and return correct result', async () => {
      const params: GetCover_Params = {
        bookmark_id: 1,
        bookmark_updated_at: '2021-01-01',
      }
      const dto_mock = 'encrypted_cover'

      data_source_mock.get_cover.mockResolvedValue(dto_mock)
      jest.spyOn(AES, 'decrypt').mockResolvedValue('decrypted_cover')

      const result = await sut.get_cover(params, encryption_key)

      expect(data_source_mock.get_cover).toHaveBeenCalledWith(params)
      expect(result).toBe('decrypted_cover')
    })
  })

  describe('[record_visit]', () => {
    it('should call data source', async () => {
      const params: RecordVisit_Params = {
        bookmark_id: 1,
        visited_at: '2021-01-01',
      }

      await sut.record_visit(params)

      expect(data_source_mock.record_visit).toHaveBeenCalledWith(params)
    })
  })

  describe('[find_by_url_hash]', () => {
    it('should call data source and return correct result', async () => {
      const params: FindByUrlHash_Params = { url: 'https://example.com' }
      const dto_mock: FindByUrlHash_Dto.Response = {
        id: 1,
        title: 'title',
        created_at: '',
        updated_at: '',
        visited_at: '',
        links: [],
        tags: [],
        is_archived: undefined,
        is_public: false,
        is_unsorted: undefined,
        note: undefined,
        note_aes: undefined,
        points: undefined,
        stars: 0,
        title_aes: undefined,
      }

      data_source_mock.find_by_url_hash.mockResolvedValue(dto_mock)

      const result = await sut.find_by_url_hash(params, encryption_key)

      expect(data_source_mock.find_by_url_hash).toHaveBeenCalledWith(
        params,
        encryption_key,
      )
      expect(result).toEqual(dto_mock)
    })
  })

  describe('[delete_bookmark_by_url_hash]', () => {
    it('calls data source correctly', async () => {
      const params: DeleteBookmarkByUrlHash_Params = { hash: 'test_hash' }

      await sut.delete_bookmark_by_url_hash(params, encryption_key)

      expect(data_source_mock.delete_bookmark_by_url_hash).toHaveBeenCalledWith(
        params,
        encryption_key,
      )
    })
  })
})
