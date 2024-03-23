import { Settings_DataSourceImpl } from '@repositories/modules/settings/infrastructure/data-sources/settings.data-source-impl'
import { SettingsAccountDispatch } from '../../settings-account.store'
import { Settings_RepositoryImpl } from '@repositories/modules/settings/infrastructure/repositories/settings.repository-impl'
import { GetMyUsername_UseCase } from '@repositories/modules/settings/domain/use-cases/get-my-username.use-case'
import { username_actions } from '../username.slice'
import { KyInstance } from 'ky'

export const get_current_username = (params: { ky: KyInstance }) => {
  return async (dispatch: SettingsAccountDispatch) => {
    const data_source = new Settings_DataSourceImpl(params.ky)
    const repository = new Settings_RepositoryImpl(data_source)
    const get_my_username = new GetMyUsername_UseCase(repository)

    dispatch(username_actions.set_is_getting_my_username(true))

    const { username } = await get_my_username.invoke()

    dispatch(username_actions.set_is_getting_my_username(false))
    dispatch(username_actions.set_current_username(username))
  }
}
