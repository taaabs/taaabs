'use client'

import { useEffect } from 'react'
import {
  use_settings_account_dispatch,
  use_settings_account_selector,
} from './_hooks/store'
import { Username } from './username'
import { username_actions } from '@repositories/stores/settings-account/username/username.slice'

const Page: React.FC = () => {
  const dispatch = use_settings_account_dispatch()
  const { my_username } = use_settings_account_selector(
    (state) => state.username,
  )

  useEffect(() => {
    dispatch(
      username_actions.get_my_username({
        api_url: process.env.NEXT_PUBLIC_API_URL,
        user_id: 'da73e988-abe7-40a5-af67-f5b38ccbd935',
      }),
    )
  }, [])

  return (
    <>{my_username ? <Username current_username={my_username} /> : 'LOADING'}</>
  )
}

export default Page
