import { useState, useEffect } from 'react'

export type Website = {
  url: string
  title: string
  length: number
  is_pinned: boolean
  is_enabled: boolean
}

interface Message {
  prompt: string
  websites: Website[]
  timestamp: number
}

const MESSAGE_HISTORY_KEY = 'messages'
const MAX_SNAPSHOTS = 50

export const use_message_history = () => {
  const [current_index, set_current_index] = useState<number>(-1)
  const [messages, set_messages] = useState<Message[]>([])
  const [temp_current_tab, set_temp_current_tab] =
    useState<Omit<Website, 'is_pinned'>>()

  // Load message history from localStorage on mount
  useEffect(() => {
    try {
      const stored_data = localStorage.getItem(MESSAGE_HISTORY_KEY)
      if (stored_data) {
        const stored_messages = JSON.parse(stored_data) as Message[]
        set_messages(stored_messages)
      }
    } catch (error) {
      console.error('Error loading message history:', error)
      // If there's an error reading from localStorage, reset it
      localStorage.removeItem(MESSAGE_HISTORY_KEY)
    }
  }, [])

  const save_message = async (prompt: string, websites: Website[]) => {
    try {
      const new_message: Message = {
        prompt,
        websites,
        timestamp: Date.now(),
      }

      // Add new snapshot and limit total number
      const updated_messages = [...messages, new_message].slice(-MAX_SNAPSHOTS)

      // Store in localStorage
      localStorage.setItem(
        MESSAGE_HISTORY_KEY,
        JSON.stringify(updated_messages),
      )

      set_messages(updated_messages)
      set_current_index(-1) // Reset to latest after new submission
    } catch (error) {
      console.error('Error saving message:', error)
    }
  }

  const navigate_back = () => {
    if (current_index < messages.length - 1) {
      set_current_index(current_index + 1)
      return messages[messages.length - 1 - current_index - 1]
    }
    return null
  }

  const navigate_forward = () => {
    if (current_index > 0) {
      set_current_index(current_index - 1)
      return messages[messages.length - 1 - current_index + 1]
    } else if (current_index == 0) {
      set_current_index(-1)
      return null // Return null to indicate returning to current state
    }
    return null
  }

  return {
    current_message:
      current_index >= 0 ? messages[messages.length - 1 - current_index] : null,
    can_navigate_back: current_index < messages.length - 1,
    can_navigate_forward: current_index >= 0,
    save_message,
    navigate_back,
    navigate_forward,
    temp_current_tab,
    set_temp_current_tab,
  }
}
