'use client'

import { useEffect } from 'react'
import {
  use_settings_account_dispatch,
  use_settings_account_selector,
} from './_hooks/store'
import { Username } from './username'
import { username_actions } from '@repositories/stores/settings-account/username/username.slice'
import ky from 'ky'

const Page: React.FC = () => {
  const dispatch = use_settings_account_dispatch()
  const username_slice_state = use_settings_account_selector(
    (state) => state.username,
  )

  const ky_instance = ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQmNEZSIsImlhdCI6MTcxMDM1MjExNn0.ZtpENZ0tMnJuGiOM-ttrTs5pezRH-JX4_vqWDKYDPWY`,
      'Content-Type': 'application/json',
    },
  })

  useEffect(() => {
    dispatch(
      username_actions.get_current_username({
        ky: ky_instance,
      }),
    )
  }, [])

  return (
    <>
      <Username current_username={username_slice_state.current_username} />
    </>
  )
}

export default Page
