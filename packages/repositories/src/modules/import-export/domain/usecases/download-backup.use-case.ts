import { UseCase } from '@repositories/core/use-case'
import { ImportExport_Repository } from '../repositories/import-export.repository'
import { DownloadBackup_Params } from '../types/download-backup.params'

export class DownloadBackup_UseCase
  implements UseCase<Promise<string>, DownloadBackup_Params>
{
  constructor(
    private readonly _import_export_repository: ImportExport_Repository,
  ) {}

  public async invoke(params: DownloadBackup_Params): Promise<string> {
    return this._import_export_repository.download_backup(params)
  }
}
