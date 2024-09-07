import { get_auth_data } from '@/helpers/get-auth-data'
import { is_message } from '@/utils/is-message'
import { SHA256 } from '@repositories/utils/sha256'
import { update_icon } from '../helpers/update-icon'
import { get_ky_instance } from '../api/get-ky-instance'

export const delete_bookmark = () => {
  chrome.runtime.onMessage.addListener((request: any, _, sendResponse) => {
    if (is_message(request) && request.action == 'delete-bookmark') {
      ;(async () => {
        const ky_instance = get_ky_instance()
        const auth_data = await get_auth_data()
        const url_hash = await SHA256(
          request.data.url,
          new Uint8Array(auth_data.encryption_key),
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
