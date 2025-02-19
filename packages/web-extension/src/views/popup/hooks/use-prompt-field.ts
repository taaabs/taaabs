import { useEffect, useState } from 'react'

const TEXT_MODE_PROMPT_STORAGE_KEY = 'prompt-field-text'
const VISION_MODE_PROMPT_STORAGE_KEY = 'prompt-field-vision'

export const use_prompt_field = () => {
  const [value, set_value] = useState('')
  const [is_vision_mode, set_is_vision_mode] = useState(false)

  // Get the appropriate storage key based on the current mode
  const get_storage_key = () => {
    return is_vision_mode ? VISION_MODE_PROMPT_STORAGE_KEY : TEXT_MODE_PROMPT_STORAGE_KEY
  }

  // Load saved value on mount if persistence is enabled
  useEffect(() => {
    const stored_value = localStorage.getItem(get_storage_key())
    if (stored_value) {
      set_value(stored_value)
    }
  }, [is_vision_mode]) // Re-run when mode changes

  // Update local storage when value changes and persistence is enabled
  const update_value = (new_value: string) => {
    set_value(new_value)
    localStorage.setItem(get_storage_key(), new_value)
  }

  // Update vision mode state
  const set_mode = (vision_mode: boolean) => {
    if (vision_mode != is_vision_mode) {
      set_is_vision_mode(vision_mode)
      const stored_value = localStorage.getItem(
        vision_mode ? VISION_MODE_PROMPT_STORAGE_KEY : TEXT_MODE_PROMPT_STORAGE_KEY
      )
      set_value(stored_value || '')
    }
  }

  return {
    value,
    update_value,
    set_mode,
  }
}