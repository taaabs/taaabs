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
  const username_slice_state = use_settings_account_selector(
    (state) => state.username,
  )

  useEffect(() => {
    dispatch(
      username_actions.get_current_username({
        ky: ky_instance,
        user_id: 'da73e988-abe7-40a5-af67-f5b38ccbd935',
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
