import { MetadataDataSource } from './metadata-data-source'
import { MetadataDto } from '@shared/types/modules/metadata/metadata.dto'
import { MetadataParams } from '../../domain/types/metadata.params'

export class MetadataDataSourceImpl implements MetadataDataSource {
  constructor(private readonly _apiUrl: string) {}

  public async getAuthorized(): Promise<MetadataDto.Response.Authorized> {
    return fetch(`${this._apiUrl}/v1/metadata`).then((r) => r.json())
  }

  public async getPublic(
    params: MetadataParams.Public,
  ): Promise<MetadataDto.Response.Public> {
    return fetch(`${this._apiUrl}/v1/metadata/${params.username}`).then((r) =>
      r.json(),
    )
  }
}
