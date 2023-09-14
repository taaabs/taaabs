import { MetadataDataSource } from './metadata-data-source'
import { MetadataDto } from '@shared/types/modules/metadata/metadata.dto'
import { MetadataParams } from '../../domain/types/metadata.params'

export class MetadataDataSourceImpl implements MetadataDataSource {
  constructor(private readonly _api_url: string) {}

  public async get_authorized(): Promise<MetadataDto.Response.Authorized> {
    return fetch(`${this._api_url}/v1/metadata`).then((r) => r.json())
  }

  public async get_public(
    params: MetadataParams.Public,
  ): Promise<MetadataDto.Response.Public> {
    return fetch(`${this._api_url}/v1/metadata/${params.username}`).then((r) =>
      r.json(),
    )
  }
}
