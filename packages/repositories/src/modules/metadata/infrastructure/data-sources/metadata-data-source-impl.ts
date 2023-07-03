import { MetadataDataSource } from './metadata-data-source'
import { MetadataDto } from '@shared/dtos/modules/metadata/metadata.dto'
import { MetadataParams } from '../../domain/types/metadata.params'

export class MetadataDataSourceImpl implements MetadataDataSource {
  constructor(private readonly _apiUrl: string) {}

  public async getAuthorized(): Promise<MetadataDto.Response.Authorized> {
    const response = await fetch(`${this._apiUrl}/v1/metadata`)
    return await response.json()
  }

  public async getPublic(
    params: MetadataParams.Public,
  ): Promise<MetadataDto.Response.Public> {
    const response = await fetch(
      `${this._apiUrl}/v1/metadata/${params.username}`,
    )
    return await response.json()
  }
}
