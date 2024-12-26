import { useEffect, useRef, useState } from 'react'
import { get_domain_from_url } from '@shared/utils/get-domain-from-url'
import { _Bookmark } from '../_Bookmark'

export const use_favicons = (props: _Bookmark.Props) => {
  const [favicons, set_favicons] = useState<{ [domain: string]: string }>({})
  const [is_fetching, set_is_fetching] = useState<boolean>(true)
  const fetched_domains = useRef<string[]>([])

  useEffect(() => {
    const domains = props.links
      .filter((l) => !l.is_public)
      .map((link) => get_domain_from_url(link.url))

    if (domains.length > 0) {
      set_is_fetching(true)
      domains.forEach((domain) => {
        window.postMessage({ action: 'get-favicon', domain }, '*')
      })
    } else {
      set_is_fetching(false)
    }

    const message_handler = (event: MessageEvent) => {
      if (
        event.source === window &&
        event.data &&
        event.data.action == 'favicon'
      ) {
        const domain = event.data.domain
        const favicon = event.data.favicon

        // Check if any link has this domain
        if (
          !props.links.some((link) => get_domain_from_url(link.url) === domain)
        ) {
          return
        }

        // Update the favicons state
        set_favicons((prev) => ({ ...prev, [domain]: favicon }))
        fetched_domains.current.push(domain)

        // Check if all favicons have been fetched
        if (domains.every(domain => fetched_domains.current.includes(domain))) {
          set_is_fetching(false)
        }
      }
    }

    window.addEventListener('message', message_handler)

    return () => {
      window.removeEventListener('message', message_handler)
    }
  }, [props.links])

  return {
    favicons,
    is_fetching,
  }
}