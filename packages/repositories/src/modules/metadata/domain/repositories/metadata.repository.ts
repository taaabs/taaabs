import { MetadataParams } from '../types/metadata.params'
import { MetadataRo } from '../types/metadata.ro'

export type MetadataRepository = {
  get_authorized(): Promise<MetadataRo.Authorized>
  get_public(params: MetadataParams.Public): Promise<MetadataRo.Public>
}
