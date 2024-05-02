'use client'

import { browser_storage } from '@/constants/browser-storage'
import ky, { KyInstance } from 'ky'
import { ReactNode, createContext, useEffect, useRef, useState } from 'react'

type AuthData = {
  access_token: string
  refresh_token: string
}

export const AuthContext = createContext<{
  auth_data?: AuthData
  ky_instance?: KyInstance
  set_auth_data: (auth_data: AuthData) => void
} | null>(null)

export const AuthProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [auth_data, _set_auth_data] = useState<AuthData>()
  const ky_instance = useRef<KyInstance>()

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
      JSON.stringify(auth_data),
    )
  }

  useEffect(() => {
    const auth_data = JSON.parse(
      localStorage.getItem(browser_storage.local_storage.auth_data) || 'null',
    ) as AuthData | null
    if (auth_data) {
      set_auth_data(auth_data)
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
        ky_instance: ky_instance.current,
        set_auth_data,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
