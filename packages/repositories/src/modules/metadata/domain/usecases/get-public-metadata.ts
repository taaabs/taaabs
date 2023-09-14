import { UseCase } from '@repositories/core/use-case'
import { MetadataRo } from '../types/metadata.ro'
import { MetadataParams } from '../types/metadata.params'
import { MetadataRepository } from '../repositories/metadata.repository'

export class GetPublicMetadata
  implements UseCase<Promise<MetadataRo.Public>, MetadataParams.Public>
{
  constructor(private readonly _metadata_repository: MetadataRepository) {}

  public invoke(params: MetadataParams.Public): Promise<MetadataRo.Public> {
    return this._metadata_repository.get_public(params)
  }
}
