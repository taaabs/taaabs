import { get_auth_data } from '@/helpers/get-auth-data'
import ky from 'ky'
import { is_message } from '@/utils/is-message'
import { CreateBookmarkResponse } from '@/types/messages'
import { update_icon } from '../helpers/update-icon'

export const create_bookmark = () => {
  chrome.runtime.onMessage.addListener((request: any, _, sendResponse) => {
    if (is_message(request) && request.action == 'create-bookmark') {
      ;(async () => {
        const auth_data = await get_auth_data()
        const ky_instance = ky.create({
          prefixUrl: 'https://api.taaabs.com/',
          headers: {
            Authorization: `Bearer ${auth_data.access_token}`,
          },
        })

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
      })()
      return true
    }
    return false
  })
}
