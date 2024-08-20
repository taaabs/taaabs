import { KyInstance } from 'ky'
import { Tags_DataSource } from './tags.data-source'
import { Rename_Params } from '../domain/rename.params'
import { AES } from '@repositories/utils/aes'
import { SHA256 } from '@repositories/utils/sha256'
import { CheckVisibility_Dto } from '@shared/types/modules/tags/check-visibility'
import { Rename_Dto } from '@shared/types/modules/tags/rename.dto'
import { Tags_Dto } from '@shared/types/modules/tags/tags.dto'

export class Tags_DataSourceImpl implements Tags_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async tags(): Promise<Tags_Dto> {
    return this._ky('v1/tags').json()
  }

  public async rename(
    params: Rename_Params,
    encryption_key: Uint8Array,
  ): Promise<void> {
    const hash = await SHA256(params.old_name, encryption_key)
    const check_visibility_body: CheckVisibility_Dto.Request.Body = {
      hash,
    }
    const visibility_check_result: CheckVisibility_Dto.Response = await this._ky
      .post('v1/tags/check-visibility', {
        json: check_visibility_body,
      })
      .json()

    const body: Rename_Dto.Request.Body = {
      old_hash: await SHA256(params.old_name, encryption_key),
      new_hash: await SHA256(params.new_name, encryption_key),
      name: visibility_check_result.is_public ? params.new_name : undefined,
      name_aes: await AES.encrypt(
        params.new_name.trim(),
        encryption_key,
      ),
    }

    await this._ky.post('v1/tags/rename', {
      json: body,
    })
  }
}
