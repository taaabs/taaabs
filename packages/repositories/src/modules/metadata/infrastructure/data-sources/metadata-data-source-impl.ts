import { MetadataDataSource } from './metadata-data-source'
import { MetadataDto } from '@shared/types/modules/metadata/metadata.dto'
import { MetadataParams } from '../../domain/types/metadata.params'
import { KyInstance } from 'ky'

export class MetadataDataSourceImpl implements MetadataDataSource {
  constructor(private readonly _ky: KyInstance) {}

  public async get_authorized(): Promise<MetadataDto.Response.Authorized> {
    return this._ky.get(`v1/metadata`).json()
  }

  public async get_public(
    params: MetadataParams.Public,
  ): Promise<MetadataDto.Response.Public> {
    return this._ky.get(`v1/metadata/${params.username}`).json()
  }
}
