import { Crypto } from '@repositories/utils/crypto'
import { Pinned_Repository } from '../../domain/repositories/pinned.repository'
import { GetPinned_Params } from '../../domain/types/get-pinned.params'
import { GetPinned_Ro } from '../../domain/types/get-pinned.ro'
import { Pinned_DataSource } from '../data-sources/pinned.data-source'
import { UpdatePinned_Params } from '../../domain/types/update-pinned.params'

export class Pinned_RepositoryImpl implements Pinned_Repository {
  constructor(private readonly _pinned_data_source: Pinned_DataSource) {}

  public async get_pinned_authorized(): Promise<GetPinned_Ro> {
    const key = await Crypto.derive_key_from_password('my_secret_key')

    const result = await this._pinned_data_source.get_pinned_authorized()

    return await Promise.all(
      result.map(async (el) => ({
        bookmark_id: el.bookmark_id,
        created_at: el.created_at,
        is_link_public: el.is_link_public,
        url: el.url ? el.url : await Crypto.AES.decrypt(el.url_aes!, key),
        title: el.title
          ? el.title
          : el.title_aes
          ? await Crypto.AES.decrypt(el.title_aes, key)
          : undefined,
        stars: el.stars,
        is_unread: el.is_unread,
        is_archived: el.is_archived,
        tags: el.tags,
        via_wayback: el.via_wayback,
      })),
    )
  }

  public async get_pinned_public(
    params: GetPinned_Params.Public,
  ): Promise<GetPinned_Ro> {
    const result = await this._pinned_data_source.get_pinned_public({
      username: params.username,
    })

    return result.map((el) => ({
      bookmark_id: el.bookmark_id,
      created_at: el.created_at,
      url: el.url!,
      title: el.title,
      stars: el.stars,
      is_unread: el.is_unread,
      is_archived: el.is_archived,
      tags: el.tags,
      via_wayback: el.via_wayback,
    }))
  }

  public async update_pinned(params: UpdatePinned_Params): Promise<void> {
    return this._pinned_data_source.update_pinned(params)
  }
}
