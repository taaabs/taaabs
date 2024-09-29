import { useEffect, useState } from 'react'
import { send_message } from '../helpers/send-message'
import { DeleteBookmark_Message } from '@/types/messages'
import { url_cleaner } from '@shared/utils/url-cleaner/url-cleaner'

export const use_delete_bookmark = () => {
  const [is_deleting, set_is_deleting] = useState<boolean>()

  const delete_bookmark = async () => {
    set_is_deleting(true)
    const url = url_cleaner(window.location.href)
    send_message({
      action: 'delete-bookmark',
      url,
    } as DeleteBookmark_Message)
  }

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'bookmark-deleted-successfully') {
        console.debug('Bookmark deleted successfully.')
      }
    })
  }, [])

  return { delete_bookmark, is_deleting, set_is_deleting }
}
