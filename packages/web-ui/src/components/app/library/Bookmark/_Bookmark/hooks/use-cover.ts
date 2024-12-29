import { useEffect, useRef, useState } from 'react'
import { _Bookmark } from '../_Bookmark'

export const use_cover = (props: _Bookmark.Props) => {
  const [cover, set_cover] = useState<string>()
  const [is_fetching, set_is_fetching] = useState<boolean>()
  const timeout_ref = useRef<ReturnType<typeof setTimeout>>()

  const url = props.links[0]?.url

  useEffect(() => {
    if (url) {
      window.postMessage({ action: 'get-cover', url }, '*')
      timeout_ref.current = setTimeout(() => {
        set_is_fetching(true)
      }, 300)
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
        clearTimeout(timeout_ref.current)
      }
    }

    window.addEventListener('message', message_handler)

    return () => {
      window.removeEventListener('message', message_handler)
      clearTimeout(timeout_ref.current)
    }
  }, [url])

  return {
    cover,
    is_fetching,
  }
}