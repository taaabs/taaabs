import { MetadataParams } from '../types/metadata.params'
import { MetadataRo } from '../types/metadata.ro'

export type MetadataRepository = {
  getAuthorized(): Promise<MetadataRo.Authorized>
  getPublic(params: MetadataParams.Public): Promise<MetadataRo.Public>
}
