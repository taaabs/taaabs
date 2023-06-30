import { MetadataDto } from '@shared/dtos/modules/metadata/metadata.dto'
import { MetadataParams } from '../../domain/types/metadata.params'

export type MetadataDataSource = {
  getAuthorized(): Promise<MetadataDto.Response.Authorized>

  getPublic(params: MetadataParams.Public): Promise<MetadataDto.Response.Public>
}
