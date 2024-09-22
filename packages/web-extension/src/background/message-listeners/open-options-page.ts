import { is_message } from '@/utils/is-message'
import browser from 'webextension-polyfill'

export const open_options_page = () => {
  browser.runtime.onMessage.addListener((request, _, __): any => {
    if (is_message(request) && request.action == 'open-options-page') {
      browser.runtime.openOptionsPage()
    }
    return false
  })
}
