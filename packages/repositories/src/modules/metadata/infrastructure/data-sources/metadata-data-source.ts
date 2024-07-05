import { MetadataDto } from '@shared/types/modules/metadata/metadata.dto'
import { MetadataParams } from '../../domain/types/metadata.params'

export type Metadata_DataSource = {
  get_authorized(): Promise<MetadataDto.Response.Authorized>

  get_public(
    params: MetadataParams.Public,
  ): Promise<MetadataDto.Response.Public>
}
