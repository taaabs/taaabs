'use client'

import { AuthContext } from '@/app/auth-provider'
import { UserConnection_DataSourceImpl } from '@repositories/modules/user-connection/infrastructure/user-connection.data-source-impl'
import { UserConnection_RepositoryImpl } from '@repositories/modules/user-connection/infrastructure/user-connection.repository-impl'
import { useParams } from 'next/navigation'
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react'

type FollowUnfollowContext = {
  is_following?: boolean
  is_toggling?: boolean
  toggle: () => void
}

export const FollowUnfollowContext =
  createContext<FollowUnfollowContext | null>(null)

export const FollowUnfollowProvider: React.FC<{ children: ReactNode }> = (
  props,
) => {
  const auth_context = useContext(AuthContext)
  const { username }: { username: string } = useParams()
  const [is_following, set_is_following] = useState<boolean>()
  const [is_toggling, set_is_toggling] = useState<boolean>()

  const toggle = () => {
    const data_source = new UserConnection_DataSourceImpl(
      auth_context.ky_instance,
    )
    const repository = new UserConnection_RepositoryImpl(data_source)
    set_is_toggling(true)
    repository.toggle_following({ username }).then(({ is_following }) => {
      set_is_toggling(false)
      set_is_following(is_following)
    })
  }

  useEffect(() => {
    if (auth_context.auth_data) {
      const data_source = new UserConnection_DataSourceImpl(
        auth_context.ky_instance,
      )
      const repository = new UserConnection_RepositoryImpl(data_source)
      repository.check_following({ username }).then(({ is_following }) => {
        set_is_following(is_following)
      })
    }
  }, [auth_context.auth_data])

  return (
    <FollowUnfollowContext.Provider
      value={{ is_following, is_toggling, toggle }}
    >
      {props.children}
    </FollowUnfollowContext.Provider>
  )
}
