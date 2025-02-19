import { useState, useEffect } from 'react'

interface ContextSnapshot {
  prompt: string
  pinned_websites_urls: string[]
  timestamp: number
}

const CONTEXT_HISTORY_KEY = 'context-history-snapshots'
const MAX_SNAPSHOTS = 50

export const use_context_history = () => {
  const [current_index, set_current_index] = useState<number>(-1)
  const [snapshots, set_snapshots] = useState<ContextSnapshot[]>([])

  // Load context history from localStorage on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(CONTEXT_HISTORY_KEY)
      if (storedData) {
        const storedSnapshots = JSON.parse(storedData) as ContextSnapshot[]
        set_snapshots(storedSnapshots)
      }
    } catch (error) {
      console.error('Error loading context history:', error)
      // If there's an error reading from localStorage, reset it
      localStorage.removeItem(CONTEXT_HISTORY_KEY)
    }
  }, [])

  const save_snapshot = async (prompt: string, pinned_websites_urls: string[]) => {
    try {
      const newSnapshot: ContextSnapshot = {
        prompt,
        pinned_websites_urls,
        timestamp: Date.now(),
      }

      // Add new snapshot and limit total number
      const updated_snapshots = [...snapshots, newSnapshot].slice(-MAX_SNAPSHOTS)

      // Store in localStorage
      localStorage.setItem(
        CONTEXT_HISTORY_KEY,
        JSON.stringify(updated_snapshots),
      )

      set_snapshots(updated_snapshots)
      set_current_index(-1) // Reset to latest after new submission
    } catch (error) {
      console.error('Error saving context snapshot:', error)
    }
  }

  const navigate_back = () => {
    if (current_index < snapshots.length - 1) {
      set_current_index(current_index + 1)
      return snapshots[snapshots.length - 1 - current_index - 1]
    }
    return null
  }

  const navigate_forward = () => {
    if (current_index > 0) {
      set_current_index(current_index - 1)
      return snapshots[snapshots.length - 1 - current_index + 1]
    } else if (current_index === 0) {
      set_current_index(-1)
      return null // Return null to indicate returning to current state
    }
    return null
  }

  return {
    current_snapshot:
      current_index >= 0 ? snapshots[snapshots.length - 1 - current_index] : null,
    can_navigate_back: current_index < snapshots.length - 1,
    can_navigate_forward: current_index >= 0,
    save_snapshot,
    navigate_back,
    navigate_forward,
  }
}
