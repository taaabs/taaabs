import { useEffect, useState } from 'react'
import { _Bookmark } from '../_Bookmark'

export const use_cover = (props: _Bookmark.Props) => {
  const [cover, set_cover] = useState<string>()

  const url = props.links[0]?.url

  useEffect(() => {
    // Bookmark must be private or first link must be private
    if (
      props.links[0] &&
      (!props.is_public || (props.is_public && !props.links[0].is_public)) &&
      url
    ) {
      window.postMessage({ action: 'get-cover', url }, '*')
    }

    const message_handler = (event: MessageEvent) => {
      if (
        event.source === window &&
        event.data &&
        event.data.action == 'cover' &&
        event.data.url == url
      ) {
        set_cover(event.data.cover)
      }
    }

    window.addEventListener('message', message_handler)

    return () => window.removeEventListener('message', message_handler)
  }, [])

  return {
    cover,
  }
}
