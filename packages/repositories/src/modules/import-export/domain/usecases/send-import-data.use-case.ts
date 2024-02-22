import { UseCase } from '@repositories/core/use-case'
import { SendImportData_Params } from '../types/send-import-data.params'
import { ImportExport_Repository } from '../repositories/import-export.repository'

export class SendImportData_UseCase
  implements UseCase<Promise<void>, SendImportData_Params>
{
  constructor(
    private readonly _import_export_repository: ImportExport_Repository,
  ) {}

  public invoke(params: SendImportData_Params): Promise<void> {
    return this._import_export_repository.send_import_data(params)
  }
}
