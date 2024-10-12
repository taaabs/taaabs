import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'

export const use_auth_state = () => {
  const [is_authenticated, set_is_authenticated] = useState<boolean>()

  useEffect(() => {
    browser.storage.local.get('auth_data').then(({ auth_data }) => {
      set_is_authenticated(!!auth_data)
    })
  }, [])

  return {
    is_authenticated,
  }
}
