import { NoParams, UseCase } from '@repositories/core/use-case'
import { GetTagHierarchies_Ro } from '../types/get-tag-hierarchies.ro'
import { TagHierarchies_Repository } from '../repositories/tag-hierarchies.repository'

export class GetTagHierarchiesAuthorized_UseCase
  implements UseCase<Promise<GetTagHierarchies_Ro>, NoParams>
{
  constructor(
    private readonly _tag_hierarchies_repository: TagHierarchies_Repository,
  ) {}

  public invoke() {
    return this._tag_hierarchies_repository.get_tag_hierarchies_authorized()
  }
}
