import { UseCase } from '@repositories/core/use-case'
import { TagHierarchies_Repository } from '../repositories/tag-hierarchies.repository'
import { UpdateTagHierarchies_Params } from '../types/update-tag-hierarchies.params'
import { GetTagHierarchies_Ro } from '../types/get-tag-hierarchies.ro'

export class UpdateTagHierarchies_UseCase
  implements
    UseCase<Promise<GetTagHierarchies_Ro>, UpdateTagHierarchies_Params>
{
  constructor(
    private readonly _tag_hierarchies_repository: TagHierarchies_Repository,
  ) {}

  public invoke(params: UpdateTagHierarchies_Params) {
    return this._tag_hierarchies_repository.update_tag_hierarchies(params)
  }
}
