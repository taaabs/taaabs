import { ImportExport_DataSourceImpl } from '@repositories/modules/import-export/infrastructure/data-sources/import-export.data-source-impl'
import { SettingsBackupsDispatch } from '../../settings-backups.store'
import { ImportExport_RepositoryImpl } from '@repositories/modules/import-export/infrastructure/repositories/import-export.repository-impl'
import { ListBackups_UseCase } from '@repositories/modules/import-export/domain/usecases/list-backups.use-case'
import { backups_actions } from '../backups.slice'

export const get_backups = (params: {
  api_url: string
  auth_token: string
}) => {
  return async (dispatch: SettingsBackupsDispatch) => {
    const data_source = new ImportExport_DataSourceImpl(
      params.api_url,
      params.auth_token,
    )
    const repository = new ImportExport_RepositoryImpl(data_source)
    const list_backups_use_case = new ListBackups_UseCase(repository)
    dispatch(backups_actions.set_is_fetching_backups(true))
    const backups = await list_backups_use_case.invoke()
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
