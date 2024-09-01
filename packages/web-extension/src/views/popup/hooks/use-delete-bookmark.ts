import { useEffect, useState } from 'react'

export const use_delete_bookmark = () => {
  const [is_deleting, set_is_deleting] = useState<boolean>()

  const delete_bookmark = async () => {}

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.source !== window) return
      if (event.data && event.data.from === 'contentScript') {
        console.log('Received response from background script:', event.data)
      }
    })
  }, [])

  return { delete_bookmark, is_deleting, set_is_deleting }
}
