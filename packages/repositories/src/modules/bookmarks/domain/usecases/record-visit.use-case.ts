import { UseCase } from '@repositories/core/use-case'
import { RecordVisit_Params } from '../types/record-visit.params'
import { Bookmarks_Repository } from '../repositories/bookmarks.repository'

export class RecordVisit_UseCase
  implements UseCase<Promise<void>, RecordVisit_Params>
{
  constructor(private readonly _bookmarks_repository: Bookmarks_Repository) {}

  public invoke(params: RecordVisit_Params): Promise<void> {
    return this._bookmarks_repository.record_visit(params)
  }
}
