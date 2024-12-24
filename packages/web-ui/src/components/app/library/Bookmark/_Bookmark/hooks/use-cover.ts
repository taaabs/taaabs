import { useEffect, useState } from 'react'
import { _Bookmark } from '../_Bookmark'

export const use_cover = (props: _Bookmark.Props) => {
  const [cover, set_cover] = useState<string>()
  const [is_fetching, set_is_fetching] = useState<boolean>()

  const url = props.links[0]?.url

  useEffect(() => {
    if (url) {
      window.postMessage({ action: 'get-cover', url }, '*')
      set_is_fetching(true)
    }

    const message_handler = (event: MessageEvent) => {
      if (
        event.source === window &&
        event.data &&
        event.data.action == 'cover' &&
        event.data.url == url
      ) {
        if (event.data.cover) {
          set_cover(event.data.cover)
        }
        set_is_fetching(false)
      }
    }

    window.addEventListener('message', message_handler)

    return () => window.removeEventListener('message', message_handler)
  }, [])

  return {
    cover,
    is_fetching,
  }
}
