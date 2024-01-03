import { useEffect, useState } from 'react'

export const use_has_focus = () => {
  const [has_focus, set_has_focus] = useState(document.hasFocus())

  useEffect(() => {
    const on_focus = () => set_has_focus(true)
    const on_blur = () => set_has_focus(false)

    window.addEventListener('focus', on_focus)
    window.addEventListener('blur', on_blur)

    return () => {
      window.removeEventListener('focus', on_focus)
      window.removeEventListener('blur', on_blur)
    }
  }, [])

  return has_focus
}
