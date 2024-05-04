import { ImportExport_DataSourceImpl } from '@repositories/modules/import-export/infrastructure/data-sources/import-export.data-source-impl'
import { SettingsBackupsDispatch } from '../../settings-backups.store'
import { ImportExport_RepositoryImpl } from '@repositories/modules/import-export/infrastructure/repositories/import-export.repository-impl'
import { backups_actions } from '../backups.slice'
import { KyInstance } from 'ky'

export const get_backups = (params: { ky: KyInstance }) => {
  return async (dispatch: SettingsBackupsDispatch) => {
    const data_source = new ImportExport_DataSourceImpl(params.ky)
    const repository = new ImportExport_RepositoryImpl(data_source)
    dispatch(backups_actions.set_is_fetching_backups(true))
    const backups = await repository.list_backups()
    dispatch(
      backups_actions.set_backups(
        backups.map((backup) => ({
          id: backup.id,
          created_at: backup.created_at,
          name: backup.name,
        })),
      ),
    )
    dispatch(backups_actions.set_is_fetching_backups(false))
  }
}
