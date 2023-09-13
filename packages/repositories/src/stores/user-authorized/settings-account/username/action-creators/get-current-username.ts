import {
  SettingsAccountDispatch,
  SettingsAccountState,
} from '../../settings-account.store'

export const getCurrentUsername = ({
  userId,
  apiUrl,
}: {
  userId: string
  apiUrl: string
}) => {
  return async (
    dispatch: SettingsAccountDispatch,
    getState: () => SettingsAccountState,
  ) => {
    
  }
}
