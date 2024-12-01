import { useEffect, useState } from 'react'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { _Bookmark } from '../_Bookmark'

export const use_favicons = (props: _Bookmark.Props) => {
  const [favicons, set_favicons] = useState<{
    [domain: string]: string
  }>({})

  useEffect(() => {
    props.links
      .filter((l) => !l.is_public)
      .forEach((link) => {
        const domain = get_domain_from_url(link.url)
        window.postMessage({ action: 'get-favicon', domain }, '*')
      })
  }, [])

  useEffect(() => {
    const message_handler = (event: MessageEvent) => {
      if (
        event.source === window &&
        event.data &&
        event.data.action == 'favicon'
      ) {
        const domain = event.data.domain
        // Check any link has this domain as the message will be received on other bookmarks as well
        if (
          !props.links.some((link) => get_domain_from_url(link.url) == domain)
        )
          return
        if (favicons[domain]) return
        const favicon = event.data.favicon
        set_favicons({ ...favicons, [domain]: favicon })
      }
    }

    window.addEventListener('message', message_handler)

    return () => window.removeEventListener('message', message_handler)
  }, [favicons])

  return {
    favicons,
  }
}
