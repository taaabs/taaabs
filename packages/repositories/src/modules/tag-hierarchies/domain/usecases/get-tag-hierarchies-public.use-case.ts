import { UseCase } from '@repositories/core/use-case'
import { GetTagHierarchies_Ro } from '../types/get-tag-hierarchies.ro'
import { TagHierarchies_Repository } from '../repositories/tag-hierarchies.repository'
import { GetTagHierarchies_Params } from '../types/get-tag-hierarchies.params'

export class GetTagHierarchiesPublic_UseCase
  implements
    UseCase<Promise<GetTagHierarchies_Ro>, GetTagHierarchies_Params.Public>
{
  constructor(
    private readonly _tag_hierarchies_repository: TagHierarchies_Repository,
  ) {}

  public invoke(params: GetTagHierarchies_Params.Public) {
    return this._tag_hierarchies_repository.get_tag_hierarchies_public(params)
  }
}
