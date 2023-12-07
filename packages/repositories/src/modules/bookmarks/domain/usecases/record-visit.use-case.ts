import { UseCase } from '@repositories/core/use-case'
import { RecordVisit_Params } from '../types/record-visit.params'
import { Bookmarks_Repository } from '../repositories/bookmarks.repository'
import { RecordVisit_Ro } from '../types/record-visit.ro'

export class RecordVisit_UseCase
  implements UseCase<Promise<RecordVisit_Ro>, RecordVisit_Params>
{
  constructor(private readonly _bookmarks_repository: Bookmarks_Repository) {}

  public invoke(params: RecordVisit_Params): Promise<RecordVisit_Ro> {
    return this._bookmarks_repository.record_visit(params)
  }
}
