import { Crypto } from '@repositories/utils/crypto'
import { Pinned_Repository } from '../../domain/repositories/pinned.repository'
import { GetPinned_Params } from '../../domain/types/get-pinned.params'
import { GetPinned_Ro } from '../../domain/types/get-pinned.ro'
import { Pinned_DataSource } from '../data-sources/pinned.data-source'
import { UpdatePinned_Params } from '../../domain/types/update-pinned.params'

export class Pinned_RepositoryImpl implements Pinned_Repository {
  constructor(private readonly _pinned_data_source: Pinned_DataSource) {}

  public async get_pinned_authorized(
    encryption_key: Uint8Array,
  ): Promise<GetPinned_Ro> {
    const result = await this._pinned_data_source.get_pinned_authorized()

    const items: GetPinned_Ro = []

    for (const item of result) {
      items.push({
        bookmark_id: item.bookmark_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        is_public: item.is_public,
        url: item.url
          ? item.url
          : await Crypto.AES.decrypt(item.url_aes!, encryption_key),
        title: item.title
          ? item.title
          : item.title_aes
          ? await Crypto.AES.decrypt(item.title_aes, encryption_key)
          : undefined,
        stars: item.stars,
        is_unsorted: item.is_unsorted,
        is_archived: item.is_archived,
        is_parsed: item.is_parsed,
        tags: item.tags,
        open_snapshot: item.open_snapshot,
        favicon: item.favicon_aes
          ? await Crypto.AES.decrypt(item.favicon_aes, encryption_key)
          : undefined,
      })
    }

    return items
  }

  public async get_pinned_public(
    params: GetPinned_Params.Public,
  ): Promise<GetPinned_Ro> {
    const result = await this._pinned_data_source.get_pinned_public({
      username: params.username,
    })

    const items: GetPinned_Ro = []

    for (const item of result) {
      items.push({
        bookmark_id: item.bookmark_id,
        updated_at: item.updated_at,
        created_at: item.created_at,
        is_public: true,
        url: item.url!,
        title: item.title!,
        stars: item.stars,
        is_unsorted: item.is_unsorted,
        is_archived: item.is_archived,
        is_parsed: item.is_parsed,
        tags: item.tags,
        open_snapshot: item.open_snapshot,
      })
    }

    return items
  }

  public async update_pinned(
    params: UpdatePinned_Params,
    encryption_key: Uint8Array,
  ): Promise<GetPinned_Ro> {
    const result = await this._pinned_data_source.update_pinned(
      params,
      encryption_key,
    )

    const items: GetPinned_Ro = []

    for (const item of result) {
      items.push({
        bookmark_id: item.bookmark_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        url: item.url
          ? item.url
          : await Crypto.AES.decrypt(item.url_aes!, encryption_key),
        title: item.title
          ? item.title
          : item.title_aes
          ? await Crypto.AES.decrypt(item.title_aes, encryption_key)
          : undefined,
        stars: item.stars,
        is_unsorted: item.is_unsorted,
        is_archived: item.is_archived,
        tags: item.tags,
        open_snapshot: item.open_snapshot,
        favicon: item.favicon_aes
          ? await Crypto.AES.decrypt(item.favicon_aes, encryption_key)
          : undefined,
        is_parsed: item.is_parsed,
        is_public: item.is_public,
      })
    }

    return items
  }
}
