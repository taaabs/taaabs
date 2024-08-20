import { KyInstance } from 'ky'
import { Pinned_DataSource } from './pinned.data-source'
import { Pinned_Dto } from '@shared/types/modules/pinned/pinned.dto'
import { GetPinned_Params } from '../../domain/types/get-pinned.params'
import { UpdatePinned_Params } from '../../domain/types/update-pinned.params'
import { UpdatePinned_Dto } from '@shared/types/modules/pinned/update-pinned.dto'
import { AES } from '@repositories/utils/aes'
import { SHA256 } from '@repositories/utils/sha256'

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
  ): Promise<Pinned_Dto.Response> {
    const items: UpdatePinned_Dto.Item[] = []
    for (const item of params.items) {
      items.push({
        hash: await SHA256(item.url.trim(), encryption_key),
        title: item.is_public ? item.title : undefined,
        title_aes:
          !item.is_public && item.title
            ? await AES.encrypt(item.title, encryption_key)
            : undefined,
      })
    }

    const body: UpdatePinned_Dto.Body = items

    return this._ky
      .put('v1/pinned', {
        json: body,
      })
      .json()
  }
}
