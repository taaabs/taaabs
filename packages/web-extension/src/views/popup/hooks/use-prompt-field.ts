import { useEffect, useState } from 'react'

const TEXT_MODE_PROMPT_STORAGE_KEY = 'prompt-field-text'
const VISION_MODE_PROMPT_STORAGE_KEY = 'prompt-field-vision'
const ONE_HOUR_IN_MS = 60 * 60 * 1000

interface StoredPrompt {
  value: string
  timestamp: number
}

export const use_prompt_field = () => {
  const [value, set_value] = useState('')
  const [is_vision_mode, set_is_vision_mode] = useState(false)

  // Get the appropriate storage key based on the current mode
  const get_storage_key = () => {
    return is_vision_mode
      ? VISION_MODE_PROMPT_STORAGE_KEY
      : TEXT_MODE_PROMPT_STORAGE_KEY
  }

  // Load saved value on mount if persistence is enabled and not expired
  useEffect(() => {
    const stored_data = localStorage.getItem(get_storage_key())
    if (stored_data) {
      try {
        const parsed_data: StoredPrompt = JSON.parse(stored_data)
        const current_time = Date.now()

        // Only restore if the stored value is less than one hour old
        if (current_time - parsed_data.timestamp <= ONE_HOUR_IN_MS) {
          set_value(parsed_data.value)
        } else {
          // Clear expired data
          localStorage.removeItem(get_storage_key())
        }
      } catch {
        // Handle legacy format or invalid JSON
        localStorage.removeItem(get_storage_key())
      }
    }
  }, [is_vision_mode]) // Re-run when mode changes

  // Update local storage when value changes and persistence is enabled
  const update_value = (new_value: string) => {
    set_value(new_value)

    // Store both the value and current timestamp
    const data_to_store: StoredPrompt = {
      value: new_value,
      timestamp: Date.now(),
    }
    localStorage.setItem(get_storage_key(), JSON.stringify(data_to_store))
  }

  // Clear the stored value from localStorage
  const clear_stored_value = () => {
    localStorage.removeItem(get_storage_key())
    set_value('')
  }

  // Update vision mode state
  const set_mode = (vision_mode: boolean) => {
    if (vision_mode != is_vision_mode) {
      set_is_vision_mode(vision_mode)

      // Load stored value for the new mode
      const stored_data = localStorage.getItem(
        vision_mode
          ? VISION_MODE_PROMPT_STORAGE_KEY
          : TEXT_MODE_PROMPT_STORAGE_KEY,
      )

      if (stored_data) {
        try {
          const parsed_data: StoredPrompt = JSON.parse(stored_data)
          const current_time = Date.now()

          // Only restore if the stored value is less than one hour old
          if (current_time - parsed_data.timestamp <= ONE_HOUR_IN_MS) {
            set_value(parsed_data.value)
          } else {
            // Clear expired data and set empty value
            localStorage.removeItem(get_storage_key())
            set_value('')
          }
        } catch (e) {
          // Handle legacy format or invalid JSON
          localStorage.removeItem(get_storage_key())
          set_value('')
        }
      } else {
        set_value('')
      }
    }
  }

  return {
    value,
    update_value,
    clear_stored_value, // Add the new function to the return object
    set_mode,
  }
}
