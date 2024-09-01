import { is_message } from '@/utils/is-message'

export const open_options_page = () => {
  chrome.runtime.onMessage.addListener((request, _, __) => {
    if (is_message(request) && request.action == 'open-options-page') {
      chrome.runtime.openOptionsPage()
    }
    return false
  })
}
