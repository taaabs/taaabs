import { Backup_Ro } from '../types/backup.ro'
import { DownloadBackup_Params } from '../types/download-backup.params'
import { ListBackups_Ro } from '../types/list-backups.ro'
import { RequestNewBackup_Params } from '../types/request-new-backup.params'
import { SendImportData_Params } from '../types/send-import-data.params'

export type ImportExport_Repository = {
  send_import_data(
    params: SendImportData_Params,
    encryption_key: Uint8Array,
  ): Promise<void>

  list_backups(): Promise<ListBackups_Ro>

  download_backup(
    params: DownloadBackup_Params,
    encryption_key: Uint8Array,
  ): Promise<Backup_Ro>

  request_new_backup(params: RequestNewBackup_Params): Promise<void>
}
