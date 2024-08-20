import { AES } from '@repositories/utils/aes'
import { Tags_Ro } from '../domain/tags.ro'
import { Rename_Params } from '../domain/rename.params'
import { Tags_Repository } from '../domain/tags.repository'
import { Tags_DataSource } from './tags.data-source'

export class Tags_RepositoryImpl implements Tags_Repository {
  constructor(private readonly _tags_data_source: Tags_DataSource) {}

  public async tags(encryption_key: Uint8Array): Promise<Tags_Ro> {
    const result = await this._tags_data_source.tags()
    const all_tags: Tags_Ro['all'] = []
    for (const tag of result.all) {
      let name = tag.name
      if (!name) {
        if (!tag.name_aes) {
          console.error('Missing name.')
          throw new Error()
        }
        name = await AES.decrypt(tag.name_aes, encryption_key)
      }
      all_tags.push({ id: tag.id, name })
    }
    return {
      all: all_tags,
      recent_ids: result.recent_ids,
    }
  }

  public async rename(
    params: Rename_Params,
    encryption_key: Uint8Array,
  ): Promise<void> {
    return this._tags_data_source.rename(params, encryption_key)
  }
}
