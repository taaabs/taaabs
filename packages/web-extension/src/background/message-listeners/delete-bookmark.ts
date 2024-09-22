import { get_auth_data } from '@/helpers/get-auth-data'
import { is_message } from '@/utils/is-message'
import { SHA256 } from '@repositories/utils/sha256'
import { update_icon } from '../helpers/update-icon'
import { get_ky_instance } from '../api/get-ky-instance'
import browser from 'webextension-polyfill'

export const delete_bookmark = () => {
  browser.runtime.onMessage.addListener(
    (request: any, _, sendResponse): any => {
      if (is_message(request) && request.action == 'delete-bookmark') {
        ;(async () => {
          const ky_instance = get_ky_instance()
          const auth_data = await get_auth_data()
          const url_hash = await SHA256(
            request.url,
            new Uint8Array(auth_data.encryption_key),
          )

          await ky_instance
            .delete(`v1/bookmarks/delete-by-url-hash/${url_hash}`)
            .json()

          sendResponse(undefined)

          // Update the icon upon bookmark deletion
          const [current_tab] = await browser.tabs.query({
            active: true,
            currentWindow: true,
          })
          await update_icon(current_tab.id!, false)

          // Notify content scripts about the bookmark deletion
          await browser.tabs.sendMessage(current_tab.id!, {
            action: 'bookmark-deleted',
          })
        })()
        return true
      }
      return false
    },
  )
}
