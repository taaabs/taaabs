import { browser_storage } from '@/constants/browser-storage'
import { Auth_DataSourceImpl } from '@repositories/modules/auth/infrastructure/auth.data-source-impl'
import { Auth_RepositoryImpl } from '@repositories/modules/auth/infrastructure/auth.repository-impl'
import Cookies from 'js-cookie'
import ky, { KyInstance } from 'ky'
import localforage from 'localforage'
import { ReactNode, createContext, useEffect, useRef, useState } from 'react'

export type AuthDataLocalStorage = {
  id: string
  encryption_key: number[]
  username: string
  access_token: string
  refresh_token: string
}

export type GuestAuthDataLocalStorage = {
  id: string
  password: string
  encryption_key: number[]
  guest_key: string
  access_token: string
  refresh_token: string
}

type AuthData = {
  id: string
  encryption_key: Uint8Array
  username?: string
}

type AuthContext = {
  auth_data?: AuthData
  ky_instance: KyInstance
  set_auth_data: (params: {
    id: string
    username?: string
    guest_key?: string
    encryption_key: Uint8Array
    access_token: string
    refresh_token: string
  }) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContext>({} as AuthContext)

export const AuthProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [auth_data, _set_auth_data] = useState<AuthData>()
  const ky_instance = useRef(
    ky.create({
      prefixUrl: process.env.NEXT_PUBLIC_API_URL,
      retry: {
        limit: 100,
        methods: ['get', 'post', 'put', 'delete'],
        backoffLimit: 1000,
        statusCodes: [401, 429, 502],
      },
      hooks: {
        beforeRequest: [
          async (request) => {
            const auth_data = JSON.parse(
              localStorage.getItem(browser_storage.local_storage.auth_data) ||
                'null',
            ) as AuthDataLocalStorage | null
            if (auth_data) {
              request.headers.set(
                'Authorization',
                `Bearer ${auth_data.access_token}`,
              )
            } else {
              const guest_auth_data = JSON.parse(
                localStorage.getItem(
                  browser_storage.local_storage.guest_auth_data,
                ) || 'null',
              ) as GuestAuthDataLocalStorage | null
              if (guest_auth_data) {
                request.headers.set(
                  'Authorization',
                  `Bearer ${guest_auth_data.access_token}`,
                )
              }
            }
          },
        ],
        afterResponse: [
          async (request, _, response) => {
            if (response.status == 401) {
              // Token has expired, refresh it
              const auth_data_local_storage = JSON.parse(
                localStorage.getItem(browser_storage.local_storage.auth_data) ||
                  'null',
              ) as AuthDataLocalStorage | null

              const guest_auth_data_local_storage = JSON.parse(
                localStorage.getItem(
                  browser_storage.local_storage.guest_auth_data,
                ) || 'null',
              ) as GuestAuthDataLocalStorage | null

              let auth_data_to_refresh:
                | AuthDataLocalStorage
                | GuestAuthDataLocalStorage
                | null = null

              if (auth_data_local_storage) {
                auth_data_to_refresh = auth_data_local_storage
              } else if (guest_auth_data_local_storage) {
                auth_data_to_refresh = guest_auth_data_local_storage
              }

              if (auth_data_to_refresh) {
                const is_refreshing_token = sessionStorage.getItem(
                  browser_storage.session_storage.is_refreshing_auth_tokens,
                )

                if (!is_refreshing_token) {
                  sessionStorage.setItem(
                    browser_storage.session_storage.is_refreshing_auth_tokens,
                    'true',
                  )

                  try {
                    const data_source = new Auth_DataSourceImpl(
                      ky_instance.current,
                    )
                    const repository = new Auth_RepositoryImpl(data_source)
                    const result = await repository.refresh({
                      access_token: auth_data_to_refresh.access_token,
                      refresh_token: auth_data_to_refresh.refresh_token,
                    })

                    if (auth_data_local_storage) {
                      localStorage.setItem(
                        browser_storage.local_storage.auth_data,
                        JSON.stringify({
                          ...auth_data_local_storage,
                          access_token: result.access_token,
                          refresh_token: result.refresh_token,
                        }),
                      )
                    } else if (guest_auth_data_local_storage) {
                      localStorage.setItem(
                        browser_storage.local_storage.guest_auth_data,
                        JSON.stringify({
                          ...guest_auth_data_local_storage,
                          access_token: result.access_token,
                          refresh_token: result.refresh_token,
                        }),
                      )
                    }

                    request.headers.set(
                      'Authorization',
                      `Bearer ${result.access_token}`,
                    )
                  } catch {
                    // If refreshing the token fails, log the user out
                    logout()
                  } finally {
                    sessionStorage.removeItem(
                      browser_storage.session_storage.is_refreshing_auth_tokens,
                    )
                  }
                }
              }
            }
          },
        ],
      },
    }),
  )

  const set_auth_data = (params: {
    id: string
    username?: string
    guest_key?: string
    password?: string
    encryption_key: Uint8Array
    access_token: string
    refresh_token: string
  }) => {
    _set_auth_data({
      id: params.id,
      username: params.username,
      encryption_key: params.encryption_key,
    })
    if (params.guest_key && params.password) {
      const guest_auth_data: GuestAuthDataLocalStorage = {
        id: params.id,
        guest_key: params.guest_key,
        password: params.password,
        encryption_key: [...params.encryption_key],
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      }
      localStorage.setItem(
        browser_storage.local_storage.guest_auth_data,
        JSON.stringify(guest_auth_data),
      )
      Cookies.set('guest_id', params.id, { expires: 365 })
    } else if (params.username) {
      const auth_data: AuthDataLocalStorage = {
        id: params.id,
        username: params.username,
        encryption_key: [...params.encryption_key],
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      }
      localStorage.setItem(
        browser_storage.local_storage.auth_data,
        JSON.stringify(auth_data),
      )
      Cookies.set('user_id', params.id, { expires: 365 })
    }
  }

  const logout = async () => {
    localStorage.removeItem(browser_storage.local_storage.auth_data)
    sessionStorage.removeItem(
      browser_storage.session_storage.is_refreshing_auth_tokens,
    )
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
    Cookies.remove('user_id')
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
    } else {
      const guest_auth_data = JSON.parse(
        localStorage.getItem(browser_storage.local_storage.guest_auth_data) ||
          'null',
      ) as GuestAuthDataLocalStorage | null
      if (guest_auth_data) {
        set_auth_data({
          id: guest_auth_data.id,
          guest_key: guest_auth_data.guest_key,
          encryption_key: new Uint8Array(guest_auth_data.encryption_key),
          access_token: guest_auth_data.access_token,
          refresh_token: guest_auth_data.refresh_token,
        })
      }
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        auth_data,
        ky_instance: ky_instance.current,
        set_auth_data,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
