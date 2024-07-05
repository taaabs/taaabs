import { MetadataRepository } from '../../domain/repositories/metadata.repository'
import { MetadataParams } from '../../domain/types/metadata.params'
import { MetadataRo } from '../../domain/types/metadata.ro'
import { Metadata_DataSource } from '../data-sources/metadata-data-source'

export class MetadataRepositoryImpl implements MetadataRepository {
  constructor(private readonly _Metadata_DataSource: Metadata_DataSource) {}

  public async get_authorized(): Promise<MetadataRo.Authorized> {
    const response = await this._Metadata_DataSource.get_authorized()

    return {
      username: response.username,
      display_name: response.display_name,
      is_email_confirmed: response.is_email_confirmed,
      registered_at: new Date(response.registered_at),
      avatar: response.avatar
        ? {
            url: response.avatar.url,
            blurhash: response.avatar.blurhash,
          }
        : undefined,
    }
  }

  public async get_public(
    params: MetadataParams.Public,
  ): Promise<MetadataRo.Public> {
    const response = await this._Metadata_DataSource.get_public({
      username: params.username,
    })

    return {
      username: response.username,
      display_name: response.display_name,
      meta_description: response.meta_description,
      avatar: response.avatar
        ? {
            url: response.avatar.url,
            blurhash: response.avatar.blurhash,
          }
        : undefined,
    }
  }
}
