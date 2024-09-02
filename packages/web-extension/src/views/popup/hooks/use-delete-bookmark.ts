import { useEffect, useState } from 'react'
import { send_message } from '../helpers/send-message'
import { DeleteBookmarkMessage } from '@/types/messages'

export const use_delete_bookmark = () => {
  const [is_deleting, set_is_deleting] = useState<boolean>()

  const delete_bookmark = async () => {
    set_is_deleting(true)
    send_message({
      action: 'delete-bookmark',
      data: { url: window.location.href },
    } as DeleteBookmarkMessage)
  }

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'bookmark-deleted-successfully') {
        console.log('Bookmark deleted successfully.')
      }
    })
  }, [])

  return { delete_bookmark, is_deleting, set_is_deleting }
}
