import { DownloadBackup_Params } from '../types/download-backup.params'
import { ListBackups_Ro } from '../types/list-backups.ro'
import { SendImportData_Params } from '../types/send-import-data.params'

export type ImportExport_Repository = {
  send_import_data(params: SendImportData_Params): Promise<void>
  list_backups(): Promise<ListBackups_Ro>
  download_backup(params: DownloadBackup_Params): Promise<string>
  // request_new_backup(): Promise<void>
}