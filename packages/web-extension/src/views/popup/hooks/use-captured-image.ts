import { useEffect, useState } from 'react'

export const use_captured_image = () => {
  const [image, set_image] = useState<string | null>()
  const [captured_at, set_captured_at] = useState<number>()

  useEffect(() => {
    const handle_message = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'captured-image') {
        set_image(event.data.captured_image || null)
        set_captured_at(Date.now())
      }
    }
    window.addEventListener('message', handle_message)
    window.postMessage({ action: 'get-captured-image' }, '*')
    return () => window.removeEventListener('message', handle_message)
  }, [])

  const remove = () => {
    window.postMessage({ action: 'remove-captured-image' }, '*')
  }

  return {
    image,
    captured_at,
    set_image,
    remove,
  }
}
