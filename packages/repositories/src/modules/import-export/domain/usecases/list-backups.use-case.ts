import { NoParams, UseCase } from '@repositories/core/use-case'
import { ListBackups_Ro } from '../types/list-backups.ro'
import { ImportExport_Repository } from '../repositories/import-export.repository'

export class ListBackups_UseCase
  implements UseCase<Promise<ListBackups_Ro>, NoParams>
{
  constructor(
    private readonly _import_export_repository: ImportExport_Repository,
  ) {}

  public invoke(): Promise<ListBackups_Ro> {
    return this._import_export_repository.list_backups()
  }
}
