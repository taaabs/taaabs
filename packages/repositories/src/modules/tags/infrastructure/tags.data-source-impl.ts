import { KyInstance } from 'ky'
import { Tags_DataSource } from './tags.data-source'
import { RenameTag_Params } from '../domain/rename-tag.params'
import { Crypto } from '@repositories/utils/crypto'
import { CheckVisibility_Dto } from '@shared/types/modules/tags/check-visibility'
import { Rename_Dto } from '@shared/types/modules/tags/rename.dto'

export class Tags_DataSourceImpl implements Tags_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async rename(
    params: RenameTag_Params,
    encryption_key: Uint8Array,
  ): Promise<void> {
    const hash = await Crypto.SHA256(params.old_tag_name, encryption_key)
    const check_visibility_body: CheckVisibility_Dto.Request.Body = {
      hash,
    }
    const visibility_check_result: CheckVisibility_Dto.Response = await this._ky
      .post('v1/tags/check-visibility', {
        json: check_visibility_body,
      })
      .json()

    const body: Rename_Dto.Request.Body = {
      old_hash: await Crypto.SHA256(params.old_tag_name, encryption_key),
      new_hash: await Crypto.SHA256(params.new_tag_name, encryption_key),
      // we should check if tag is public before doing update
      name: visibility_check_result.is_public ? params.new_tag_name : undefined,
      name_aes: await Crypto.AES.encrypt(
        params.new_tag_name.trim(),
        encryption_key,
      ),
    }

    await this._ky.post('v1/tags/rename', {
      json: body,
    })
  }
}
