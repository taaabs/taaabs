import { MetadataEntity } from '../entities/metadata.entity'

export type MetadataRepository = {
  getAuthorizedMetadata(): Promise<MetadataEntity.Authorized>
  getPublicMetadata({
    username,
  }: {
    username: string
  }): Promise<MetadataEntity.Public>
}
