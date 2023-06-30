import { AxiosInstance, AxiosResponse } from 'axios'
import { MetadataDataSource } from './metadata-data-source'
import { MetadataDto } from '@shared/dtos/modules/metadata/metadata.dto'
import { MetadataParams } from '../../domain/types/metadata.params'

export class MetadataDataSourceImpl implements MetadataDataSource {
  constructor(private readonly _axios: AxiosInstance) {}

  public async getAuthorized(): Promise<MetadataDto.Response.Authorized> {
    const response: AxiosResponse<MetadataDto.Response.Authorized> =
      await this._axios.get('/v1/metadata')

    return response.data
  }

  public async getPublic(
    params: MetadataParams.Public,
  ): Promise<MetadataDto.Response.Public> {
    const response: AxiosResponse<MetadataDto.Response.Public> =
      await this._axios.get(`/v1/metadata/${params.username}`)

    return response.data
  }
}
