import { update_icon } from '@/background/helpers/update-icon'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'

export const use_saved_check = () => {
  const [is_saved, set_is_saved] = useState<boolean>()

  useUpdateEffect(() => {
    browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(([current_tab]) => {
        update_icon(current_tab.id!, is_saved)
      })
  }, [is_saved])

  useEffect(() => {
    browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(async ([current_tab]) => {
        const action = browser.browserAction || browser.action
        const has_badge_text = !!(await action.getBadgeText({
          tabId: current_tab.id,
        }))
        set_is_saved(has_badge_text)
      })
  }, [])

  return {
    is_saved,
    set_is_saved,
  }
}
