import { KyInstance } from 'ky'
import { Pinned_DataSource } from './pinned.data-source'
import { Pinned_Dto } from '@shared/types/modules/pinned/pinned.dto'
import { GetPinned_Params } from '../../domain/types/get-pinned.params'
import { UpdatePinned_Params } from '../../domain/types/update-pinned.params'
import { UpdatePinned_Dto } from '@shared/types/modules/pinned/update-pinned.dto'
import { Crypto } from '@repositories/utils/crypto'

export class Pinned_DataSourceImpl implements Pinned_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async get_pinned_authorized(): Promise<Pinned_Dto.Response> {
    return this._ky.get('v1/pinned').json()
  }

  public async get_pinned_public(
    params: GetPinned_Params.Public,
  ): Promise<Pinned_Dto.Response> {
    return this._ky.get(`v1/pinned/${params.username}`).json()
  }

  public async update_pinned(
    params: UpdatePinned_Params,
    encryption_key: Uint8Array,
  ): Promise<void> {
    const body: UpdatePinned_Dto.Body = await Promise.all(
      params.map(async (pinned_item) => ({
        hash: await Crypto.SHA256(pinned_item.url.trim(), encryption_key),
        title: pinned_item.is_link_public ? pinned_item.title : undefined,
        title_aes:
          !pinned_item.is_link_public && pinned_item.title
            ? await Crypto.AES.encrypt(pinned_item.title, encryption_key)
            : undefined,
      })),
    )
    return this._ky
      .put('v1/pinned', {
        body: JSON.stringify(body),
      })
      .json()
  }
}
