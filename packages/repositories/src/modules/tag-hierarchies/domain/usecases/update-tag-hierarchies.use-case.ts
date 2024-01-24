import { UseCase } from '@repositories/core/use-case'
import { TagHierarchies_Repository } from '../repositories/tag-hierarchies.repository'
import { UpdateTagHierarchies_Params } from '../types/update-tag-hierarchies.params'

export class UpdateTagHierarchies_UseCase
  implements UseCase<Promise<void>, UpdateTagHierarchies_Params>
{
  constructor(
    private readonly _tag_hierarchies_repository: TagHierarchies_Repository,
  ) {}

  public invoke(params: UpdateTagHierarchies_Params) {
    return this._tag_hierarchies_repository.update_tag_hierarchies(params)
  }
}
