'use client'
import { UserDataActions } from '@/features/user-data/presentation/redux/user-data.slice'
import { useAppDispatch } from '@/hooks/store'
import { useEffect } from 'react'

export const ReduxInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(UserDataActions.fetchUserData())
  })

  return <>{children}</>
}
