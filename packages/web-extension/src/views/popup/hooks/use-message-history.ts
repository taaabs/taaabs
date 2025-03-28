import { useState, useEffect } from 'react'
import { websites_store } from './use-websites-store'

export type Website = {
  url: string
  title: string
  length: number
  favicon?: string
}

interface Message {
  prompt: string
  websites: Website[]
  timestamp: number
}

const MESSAGE_HISTORY_KEY = 'messages'
const MAX_MESSAGES = 50

export const use_message_history = () => {
  const [current_index, set_current_index] = useState<number>(-1)
  const [messages, set_messages] = useState<Message[]>([])

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

  const cleanup_unused_websites = async (
    removed_messages: Message[],
    remaining_messages: Message[],
  ) => {
    try {
      // Create a set of all website URLs used in removed messages
      const removed_urls = new Set(
        removed_messages.flatMap((message) =>
          message.websites.map((website) => website.url),
        ),
      )

      // Create a set of all website URLs still in use by remaining messages
      const active_urls = new Set(
        remaining_messages.flatMap((message) =>
          message.websites.map((website) => website.url),
        ),
      )

      // Find URLs that are in removed messages but not in any remaining message
      const urls_to_delete = Array.from(removed_urls).filter(
        (url) => !active_urls.has(url),
      )

      // Delete unused websites from IndexedDB
      for (const url of urls_to_delete) {
        await websites_store.removeItem(url)
      }
    } catch (error) {
      console.error('Error cleaning up unused websites:', error)
    }
  }

  const save_message = async (prompt: string, websites: Website[]) => {
    try {
      const new_message: Message = {
        prompt,
        websites,
        timestamp: Date.now(),
      }

      // Store messages that will be removed due to MAX_MESSAGES limit
      const messages_to_remove =
        messages.length >= MAX_MESSAGES
          ? messages.slice(0, messages.length - MAX_MESSAGES + 1)
          : []

      // Add new message and limit total number
      const updated_messages = [...messages, new_message].slice(-MAX_MESSAGES)

      // Clean up websites from removed messages that are no longer used
      if (messages_to_remove.length > 0) {
        await cleanup_unused_websites(messages_to_remove, updated_messages)
      }

      // Store in localStorage
      localStorage.setItem(
        MESSAGE_HISTORY_KEY,
        JSON.stringify(updated_messages),
      )

      set_messages(updated_messages)
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
    current_index,
    set_current_index,
    current_message:
      current_index >= 0 ? messages[messages.length - 1 - current_index] : null,
    can_navigate_back: current_index < messages.length - 1,
    can_navigate_forward: current_index >= 0,
    save_message,
    navigate_back,
    navigate_forward,
  }
}
