import { AppDispatch, RootState } from '@/store'
import { UserDataActions } from '../user-data.slice'

export const fetchUserData = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const state = { ...getState() }

    // call clean arch stuff

    // dispatch(UserDataActions.setUserData())
    dispatch(UserDataActions.setIsLoading(false))
  }
}
