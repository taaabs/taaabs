import { KyInstance } from 'ky'
import { Tags_DataSource } from './tags.data-source'
import { Rename_Params } from '../domain/rename.params'
import { Crypto } from '@repositories/utils/crypto'
import { CheckVisibility_Dto } from '@shared/types/modules/tags/check-visibility'
import { Rename_Dto } from '@shared/types/modules/tags/rename.dto'
import { Tags_Dto } from '@shared/types/modules/tags/tags.dto'
import { Suggested_Dto } from '@shared/types/modules/tags/suggested.dto'
import { Suggested_Params } from '../domain/suggested.params'

export class Tags_DataSourceImpl implements Tags_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async all(): Promise<Tags_Dto> {
    return this._ky('v1/tags').json()
  }

  public async suggested(
    params: Suggested_Params,
  ): Promise<Suggested_Dto.Response> {
    const body: Suggested_Dto.Request.Body = params.selected_tags
    return this._ky
      .post('v1/tags/suggested', {
        json: body,
      })
      .json()
  }

  public async rename(
    params: Rename_Params,
    encryption_key: Uint8Array,
  ): Promise<void> {
    const hash = await Crypto.SHA256(params.old_name, encryption_key)
    const check_visibility_body: CheckVisibility_Dto.Request.Body = {
      hash,
    }
    const visibility_check_result: CheckVisibility_Dto.Response = await this._ky
      .post('v1/tags/check-visibility', {
        json: check_visibility_body,
      })
      .json()

    const body: Rename_Dto.Request.Body = {
      old_hash: await Crypto.SHA256(params.old_name, encryption_key),
      new_hash: await Crypto.SHA256(params.new_name, encryption_key),
      name: visibility_check_result.is_public ? params.new_name : undefined,
      name_aes: await Crypto.AES.encrypt(
        params.new_name.trim(),
        encryption_key,
      ),
    }

    await this._ky.post('v1/tags/rename', {
      json: body,
    })
  }
}
