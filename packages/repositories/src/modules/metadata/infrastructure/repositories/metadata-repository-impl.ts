import { MetadataRepository } from '../../domain/repositories/metadata.repository'
import { MetadataParams } from '../../domain/types/metadata.params'
import { MetadataRo } from '../../domain/types/metadata.ro'
import { MetadataDataSource } from '../data-sources/metadata-data-source'

export class MetadataRepositoryImpl implements MetadataRepository {
  constructor(private readonly _metadataDataSource: MetadataDataSource) {}

  public async getAuthorized(): Promise<MetadataRo.Authorized> {
    const response = await this._metadataDataSource.getAuthorized()

    return {
      username: response.username,
      displayName: response.display_name || null,
      isEmailConfirmed: response.is_email_confirmed,
      registeredAt: new Date(response.registered_at),
      avatar: response.avatar
        ? {
            url: response.avatar.url,
            blurhash: response.avatar.blurhash,
          }
        : null,
    }
  }

  public async getPublic(
    params: MetadataParams.Public,
  ): Promise<MetadataRo.Public> {
    const response = await this._metadataDataSource.getPublic({
      username: params.username,
    })

    return {
      username: response.username,
      displayName: response.display_name || null,
      metaDescription: response.meta_description || null,
      avatar: response.avatar
        ? {
            url: response.avatar.url,
            blurhash: response.avatar.blurhash,
          }
        : null,
    }
  }
}
