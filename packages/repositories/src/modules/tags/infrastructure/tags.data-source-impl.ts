import { KyInstance } from 'ky'
import { Tags_DataSource } from './tags.data-source'
import { RenameTag_Params } from '../domain/rename-tag.params'
import { RenameTag_Dto } from '@shared/types/modules/tags/rename-tag.dto'
import { Crypto } from '@repositories/utils/crypto'

export class Tags_DataSourceImpl implements Tags_DataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async rename(
    params: RenameTag_Params,
    encryption_key: Uint8Array,
  ): Promise<void> {
    const body: RenameTag_Dto.Body = {
      old_hash: await Crypto.SHA256(params.old_tag_name, encryption_key),
      new_hash: await Crypto.SHA256(params.new_tag_name, encryption_key),
      // we should check if tag is public before doing update
      // name:
    }
  }
}
