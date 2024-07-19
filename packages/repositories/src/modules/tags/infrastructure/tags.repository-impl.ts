import { Crypto } from '@repositories/utils/crypto'
import { All_Ro } from '../domain/all.ro'
import { Rename_Params } from '../domain/rename.params'
import { Tags_Repository } from '../domain/tags.repository'
import { Tags_DataSource } from './tags.data-source'

export class Tags_RepositoryImpl implements Tags_Repository {
  constructor(private readonly _tags_data_source: Tags_DataSource) {}

  public async all(encryption_key: Uint8Array): Promise<All_Ro> {
    const result = await this._tags_data_source.all()
    const tags: All_Ro = []
    for (const tag of result) {
      let name = tag.name
      if (!name) {
        name = await Crypto.AES.decrypt(tag.name_aes!, encryption_key)
      }
      tags.push({ id: tag.id, name })
    }
    return tags
  }

  public async rename(
    params: Rename_Params,
    encryption_key: Uint8Array,
  ): Promise<void> {
    return this._tags_data_source.rename(params, encryption_key)
  }
}
