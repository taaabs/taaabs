import { is_message } from '@/utils/is-message'
import { CreateBookmarkResponse } from '@/types/messages'
import { update_icon } from '../helpers/update-icon'
import { get_ky_instance } from '../api/get-ky-instance'

export const create_bookmark = () => {
  chrome.runtime.onMessage.addListener((request: any, _, sendResponse) => {
    if (is_message(request) && request.action == 'create-bookmark') {
      ;(async () => {
        const ky_instance = get_ky_instance()
        const created_bookmark = await ky_instance
          .post('v1/bookmarks', {
            json: request.data,
          })
          .json()

        const response: CreateBookmarkResponse = {
          bookmark: created_bookmark,
        }
        sendResponse(response)

        // Update the icon upon bookmark creation
        const [current_tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        })
        update_icon(current_tab.id!, true)

        // Notify content scripts about the bookmark creation
        chrome.tabs.sendMessage(current_tab.id!, { action: 'bookmark-created' })
      })()
      return true
    }
    return false
  })
}
