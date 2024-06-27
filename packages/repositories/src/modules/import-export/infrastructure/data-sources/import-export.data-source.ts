import { ListBackups_Dto } from '@shared/types/modules/import-export/list-backups.dto'
import { SendImportData_Params } from '../../domain/types/send-import-data.params'
import { DownloadBackup_Dto } from '@shared/types/modules/import-export/download-backup.dto'
import { DownloadBackup_Params } from '../../domain/types/download-backup.params'
import { RequestNewBackup_Params } from '../../domain/types/request-new-backup.params'

export type ImportExport_DataSource = {
  send_import_data(
    params: SendImportData_Params,
    encryption_key: Uint8Array,
  ): Promise<void>

  list_backups(): Promise<ListBackups_Dto.Response>

  download_backup(
    params: DownloadBackup_Params,
  ): Promise<DownloadBackup_Dto.Response>

  request_new_backup(params: RequestNewBackup_Params): Promise<void>
}
