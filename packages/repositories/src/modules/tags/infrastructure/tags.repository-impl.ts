import { RenameTag_Params } from '../domain/rename-tag.params'
import { Tags_Repository } from '../domain/tags.repository'
import { Tags_DataSource } from './tags.data-source'

export class Tags_RepositoryImpl implements Tags_Repository {
  constructor(private readonly _tags_data_source: Tags_DataSource) {}

  public async rename(
    params: RenameTag_Params,
    encryption_key: Uint8Array,
  ): Promise<void> {
    return this._tags_data_source.rename(params, encryption_key)
  }
}
