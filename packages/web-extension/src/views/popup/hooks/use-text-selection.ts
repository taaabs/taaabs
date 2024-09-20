import { useEffect, useState } from 'react'

export const use_text_selection = () => {
  const [selected_text, set_selected_text] = useState<string>()
  const [is_popup_open, set_is_popup_open] = useState<boolean>()

  useEffect(() => {
    if (!is_popup_open) {
      set_selected_text('')
    }
  }, [is_popup_open])

  useEffect(() => {
    if (is_popup_open) return

    const handle_selection_change = () => {
      const selection = window.getSelection()?.toString()
      if (selection) {
        set_selected_text(selection)
      }
    }

    document.addEventListener('selectionchange', handle_selection_change)
    return () => {
      document.removeEventListener('selectionchange', handle_selection_change)
    }
  }, [is_popup_open])

  useEffect(() => {
    const handle_message = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data && event.data.action == 'popup-opened') {
        set_is_popup_open(true)
      } else if (event.data && event.data.action == 'popup-closed') {
        set_is_popup_open(false)
      } else if (event.data && event.data.action == 'selected-text') {
        // Selected text is send this way only after popup initialization
        set_selected_text(event.data.selected_text)
      }
    }

    window.addEventListener('message', handle_message)
    return () => {
      window.removeEventListener('message', handle_message)
    }
  }, [])

  return {
    selected_text,
  }
}
