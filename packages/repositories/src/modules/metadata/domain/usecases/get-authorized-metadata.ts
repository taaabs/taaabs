import { NoParams, UseCase } from '@/core/use-case'
import { MetadataRo } from '../types/metadata.ro'
import { MetadataRepository } from '../repositories/metadata.repository'

export class GetAuthorizedMetadata
  implements UseCase<Promise<MetadataRo.Authorized>, NoParams>
{
  constructor(private readonly _metadatRepository: MetadataRepository) {}

  public invoke(): Promise<MetadataRo.Authorized> {
    return this._metadatRepository.getAuthorized()
  }
}
