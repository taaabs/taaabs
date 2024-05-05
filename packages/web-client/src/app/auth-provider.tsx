'use client'

import { browser_storage } from '@/constants/browser-storage'
import ky, { KyInstance } from 'ky'
import { useRouter } from 'next/navigation'
import { ReactNode, createContext, useEffect, useRef, useState } from 'react'

const default_ky_instance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
})

type AuthData = {
  id: string
  access_token: string
  refresh_token: string
  encryption_key: Uint8Array
  username: string
}

export const AuthContext = createContext<{
  auth_data?: AuthData
  ky_instance: KyInstance
  set_auth_data: (auth_data: AuthData) => void
  logout: () => void
} | null>(null)

export const AuthProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [auth_data, _set_auth_data] = useState<AuthData>()
  const ky_instance = useRef<KyInstance>()
  const router = useRouter()

  const set_auth_data = (auth_data: AuthData) => {
    _set_auth_data(auth_data)
    ky_instance.current = ky.create({
      prefixUrl: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        Authorization: `Bearer ${auth_data.access_token}`,
        'Content-Type': 'application/json',
      },
    })
    localStorage.setItem(
      browser_storage.local_storage.auth_data,
      JSON.stringify({
        ...auth_data,
        encryption_key: String.fromCharCode(...auth_data.encryption_key),
      }),
    )
    document.cookie = `user_id=${auth_data.id}; expires=${new Date(
      Date.now() + 31536000000,
    ).toUTCString()}; path=/`
  }

  const logout = () => {
    _set_auth_data(undefined)
    ky_instance.current = default_ky_instance
    localStorage.removeItem(browser_storage.local_storage.auth_data)
    document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    router.push('/login')
  }

  useEffect(() => {
    const auth_data = JSON.parse(
      localStorage.getItem(browser_storage.local_storage.auth_data) || 'null',
    )
    if (auth_data) {
      set_auth_data({
        ...auth_data,
        encryption_key: new Uint8Array(
          auth_data.encryption_key.split('').map((c: any) => c.charCodeAt(0)),
        ),
      })
      ky_instance.current = ky.create({
        prefixUrl: process.env.NEXT_PUBLIC_API_URL,
        headers: {
          Authorization: `Bearer ${auth_data.access_token}`,
          'Content-Type': 'application/json',
        },
      })
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        auth_data,
        ky_instance: ky_instance.current || default_ky_instance,
        set_auth_data,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
