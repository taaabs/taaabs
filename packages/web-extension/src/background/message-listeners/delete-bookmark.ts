import { get_auth_data } from '@/helpers/get-auth-data'
import ky from 'ky'
import { is_message } from '@/utils/is-message'
import { SHA256 } from '@repositories/utils/sha256'
import { update_icon } from '../helpers/update-icon'

export const delete_bookmark = () => {
  chrome.runtime.onMessage.addListener((request: any, _, sendResponse) => {
    if (is_message(request) && request.action == 'delete-bookmark') {
      ;(async () => {
        const auth_data = await get_auth_data()
        const ky_instance = ky.create({
          prefixUrl: 'https://api.taaabs.com/',
          headers: {
            Authorization: `Bearer ${auth_data.access_token}`,
          },
        })
        const url_hash = await SHA256(
          request.data.url,
          auth_data.encryption_key,
        )

        await ky_instance
          .delete(`v1/bookmarks/delete-by-url-hash/${url_hash}`)
          .json()

        sendResponse()

        // Update the icon upon bookmark deletion
        const [current_tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        })
        update_icon(current_tab.id!, false)
      })()
      return true
    }
    return false
  })
}
