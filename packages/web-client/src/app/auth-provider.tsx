'use client'

import { browser_storage } from '@/constants/browser-storage'
import { Auth_DataSourceImpl } from '@repositories/modules/auth/infrastructure/auth.data-source-impl'
import { Auth_RepositoryImpl } from '@repositories/modules/auth/infrastructure/auth.repository-impl'
import ky, { KyInstance } from 'ky'
import localforage from 'localforage'
import { ReactNode, createContext, useEffect, useState } from 'react'

const ky_instance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        const auth_data_local_storage = JSON.parse(
          localStorage.getItem(browser_storage.local_storage.auth_data) ||
            'null',
        ) as AuthDataLocalStorage | null
        if (auth_data_local_storage) {
          request.headers.set(
            'Authorization',
            `Bearer ${auth_data_local_storage.access_token}`,
          )
        }
      },
    ],
    afterResponse: [
      async (request, _, response) => {
        if (response.status == 401) {
          // Token has expired, refresh it.
          const auth_data_local_storage = JSON.parse(
            localStorage.getItem(browser_storage.local_storage.auth_data) ||
              'null',
          ) as AuthDataLocalStorage | null
          if (auth_data_local_storage) {
            const data_source = new Auth_DataSourceImpl(ky_instance)
            const repostiory = new Auth_RepositoryImpl(data_source)
            const result = await repostiory.refresh({
              access_token: auth_data_local_storage.access_token,
              refresh_token: auth_data_local_storage.refresh_token,
            })

            localStorage.setItem(
              browser_storage.local_storage.auth_data,
              JSON.stringify({
                ...auth_data_local_storage,
                access_token: result.access_token,
                refresh_token: result.refresh_token,
              }),
            )

            request.headers.set(
              'Authorization',
              `Bearer ${result.access_token}`,
            )

            // Retry the original request.
            return ky_instance(request)
          }
        }
      },
    ],
  },
})

export type AuthDataLocalStorage = {
  id: string
  encryption_key: number[]
  username: string
  access_token: string
  refresh_token: string
}

type AuthData = {
  id: string
  encryption_key: Uint8Array
  username: string
}

export const AuthContext = createContext<{
  auth_data?: AuthData
  ky_instance: KyInstance
  set_auth_data: (params: {
    id: string
    username: string
    encryption_key: Uint8Array
    access_token: string
    refresh_token: string
  }) => void
  logout: () => void
} | null>(null)

export const AuthProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [auth_data, _set_auth_data] = useState<AuthData>()

  const set_auth_data = (params: {
    id: string
    username: string
    encryption_key: Uint8Array
    access_token: string
    refresh_token: string
  }) => {
    _set_auth_data({
      id: params.id,
      username: params.username,
      encryption_key: params.encryption_key,
    })
    localStorage.setItem(
      browser_storage.local_storage.auth_data,
      JSON.stringify({
        id: params.id,
        username: params.username,
        encryption_key: [...params.encryption_key],
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      } as AuthDataLocalStorage),
    )
    document.cookie = `user_id=${params.id}; expires=${new Date(
      Date.now() + 31536000000,
    ).toUTCString()}; path=/`
  }

  const logout = async () => {
    _set_auth_data(undefined)
    localStorage.removeItem(browser_storage.local_storage.auth_data)
    await localforage.removeItem(
      browser_storage.local_forage.authorized_library.search.index,
    )
    await localforage.removeItem(
      browser_storage.local_forage.authorized_library.search
        .cached_at_timestamp,
    )
    await localforage.removeItem(
      browser_storage.local_forage.authorized_library.search.archived_index,
    )
    await localforage.removeItem(
      browser_storage.local_forage.authorized_library.search
        .archived_cached_at_timestamp,
    )
    document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    document.location = '/'
  }

  useEffect(() => {
    const auth_data = JSON.parse(
      localStorage.getItem(browser_storage.local_storage.auth_data) || 'null',
    ) as AuthDataLocalStorage | null
    if (auth_data) {
      set_auth_data({
        id: auth_data.id,
        username: auth_data.username,
        encryption_key: new Uint8Array(auth_data.encryption_key),
        access_token: auth_data.access_token,
        refresh_token: auth_data.refresh_token,
      })
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        auth_data,
        ky_instance,
        set_auth_data,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
