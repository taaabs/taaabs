import { useEffect, useState } from 'react'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import browser from 'webextension-polyfill'

export const use_attach_text_checkbox = () => {
  const [is_checked, set_is_checked] = useState<boolean>(true)

  useEffect(() => {
    browser.storage.local
      .get('is_attach_text_checkbox_checked')
      .then(({ is_attach_text_checkbox_checked }) => {
        if (is_attach_text_checkbox_checked !== undefined) {
          set_is_checked(is_attach_text_checkbox_checked as boolean)
        }
      })
  }, [])

  useUpdateEffect(() => {
    browser.storage.local.set({
      is_attach_text_checkbox_checked: is_checked,
    })
  }, [is_checked])

  return {
    is_checked,
    set_is_checked,
  }
}
