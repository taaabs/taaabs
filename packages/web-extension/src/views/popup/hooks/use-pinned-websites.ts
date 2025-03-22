import { useState, useEffect } from 'react'

const PINNED_URLS_KEY = 'pinned-urls'

export type PinnedWebsite = {
  url: string
  title: string
  length: number
  is_enabled: boolean
  favicon?: string
}

interface StoredPinnedUrls {
  websites: PinnedWebsite[] // Array of pinned website objects in order
}

export const use_pinned_websites = () => {
  const [pinned_websites, set_pinned_websites] = useState<PinnedWebsite[]>([])

  // Load pinned URLs from storage on mount
  useEffect(() => {
    try {
      // Get pinned URLs from localStorage
      const stored = localStorage.getItem(PINNED_URLS_KEY)
      const websites = stored
        ? (JSON.parse(stored) as StoredPinnedUrls).websites
        : []

      set_pinned_websites(websites)
    } catch (error) {
      console.error('Error loading pinned urls:', error)
    }
  }, [])

  const pin_website = (params: {
    url: string
    title: string
    length: number
    favicon?: string
  }) => {
    try {
      if (!pinned_websites.some((website) => website.url == params.url)) {
        const new_website: PinnedWebsite = {
          url: params.url,
          title: params.title,
          length: params.length,
          is_enabled: true, // New websites are enabled by default
          favicon: params.favicon,
        }
        const updated_websites = [...pinned_websites, new_website]

        // Update localStorage
        localStorage.setItem(
          PINNED_URLS_KEY,
          JSON.stringify({ websites: updated_websites }),
        )

        // Update state
        set_pinned_websites(updated_websites)
      }
    } catch (error) {
      console.error('Error pinning url:', error)
    }
  }

  const unpin_website = (url: string) => {
    try {
      const updated_websites = pinned_websites.filter(
        (website) => website.url !== url,
      )

      // Update localStorage
      localStorage.setItem(
        PINNED_URLS_KEY,
        JSON.stringify({ websites: updated_websites }),
      )

      // Update state
      set_pinned_websites(updated_websites)
    } catch (error) {
      console.error('Error unpinning url:', error)
    }
  }

  const update_websites_order = (websites: PinnedWebsite[]) => {
    try {
      // Update localStorage with new order
      localStorage.setItem(PINNED_URLS_KEY, JSON.stringify({ websites }))

      // Update state
      set_pinned_websites(websites)
    } catch (error) {
      console.error('Error updating websites order:', error)
    }
  }

  const toggle_website_enabled = (url: string) => {
    try {
      const updated_websites = pinned_websites.map((website) =>
        website.url == url
          ? { ...website, is_enabled: !website.is_enabled }
          : website,
      )

      // Update localStorage
      localStorage.setItem(
        PINNED_URLS_KEY,
        JSON.stringify({ websites: updated_websites }),
      )

      // Update state
      set_pinned_websites(updated_websites)
    } catch (error) {
      console.error('Error toggling website enabled state:', error)
    }
  }

  const replace_pinned_websites = (websites: PinnedWebsite[]) => {
    set_pinned_websites(websites)
  }

  return {
    pinned_websites,
    pin_website,
    replace_pinned_websites,
    unpin_website,
    update_websites_order,
    toggle_website_enabled,
  }
}
