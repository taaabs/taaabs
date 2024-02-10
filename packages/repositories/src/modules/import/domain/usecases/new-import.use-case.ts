import { UseCase } from '@repositories/core/use-case'
import { NewImport_Params } from '../types/new-import.params'
import { Import_Repository } from '../repositories/import.repository'

export class NewImport_UseCase
  implements UseCase<Promise<void>, NewImport_Params>
{
  constructor(private readonly _import_repository: Import_Repository) {}

  public invoke(params: NewImport_Params): Promise<void> {
    return this._import_repository.new_import(params)
  }
}
