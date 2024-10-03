import { useEffect, useState } from 'react'

export const use_captured_image = () => {
  const [original_image, set_original_image] = useState<string | null>()
  const [image, set_image] = useState<string | null>()

  useEffect(() => {
    const handle_message = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'captured-image') {
        if (
          event.data.captured_image != original_image ||
          original_image === undefined
        ) {
          set_original_image(event.data.captured_image || null)
          set_image(event.data.captured_image || null)
        }
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
    original_image,
    image,
    set_image,
    remove,
  }
}
