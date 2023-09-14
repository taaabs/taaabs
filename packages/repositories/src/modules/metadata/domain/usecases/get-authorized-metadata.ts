import { NoParams, UseCase } from '@repositories/core/use-case'
import { MetadataRo } from '../types/metadata.ro'
import { MetadataRepository } from '../repositories/metadata.repository'

export class GetAuthorizedMetadata
  implements UseCase<Promise<MetadataRo.Authorized>, NoParams>
{
  constructor(private readonly _metadat_repository: MetadataRepository) {}

  public invoke(): Promise<MetadataRo.Authorized> {
    return this._metadat_repository.get_authorized()
  }
}
