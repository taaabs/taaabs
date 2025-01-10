import { useEffect, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import browser from 'webextension-polyfill'

export const use_save_prompt_switch = () => {
  const [is_checked, set_is_checked] = useState<boolean>(true)

  useEffect(() => {
    browser.storage.local
      .get('is_save_prompt_checked')
      .then(({ is_save_prompt_checked }) => {
        if (is_save_prompt_checked !== undefined) {
          set_is_checked(is_save_prompt_checked as boolean)
        }
      })
  }, [])

  useUpdateEffect(() => {
    browser.storage.local.set({
      is_save_prompt_checked: is_checked,
    })
  }, [is_checked])

  return {
    is_checked,
    set_is_checked,
  }
}
