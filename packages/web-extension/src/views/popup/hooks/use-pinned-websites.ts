import { useState, useEffect } from 'react'
import localforage from 'localforage'

export interface StoredPinnedWebsite {
  url: string
  title: string
  plain_text: string
  pinned_at: number
  is_enabled: boolean // Added this field to persist enabled state
}

// Initialize localforage instance for website data
const STORE_NAME = 'pinned-websites'
export const websites_store = localforage.createInstance({
  name: 'taaabs',
  storeName: STORE_NAME,
})

// Key for localStorage to store pinned websites order
const PINNED_WEBSITES_KEY = 'pinned-websites'

type PinnedWebsite = {
  url: string
  title: string
  plain_text: string
  is_enabled: boolean
}

interface StoredPinnedUrls {
  urls: string[] // Array of pinned website URLs in order
}

export const use_pinned_websites = () => {
  const [pinned_websites, set_pinned_websites] = useState<PinnedWebsite[]>([])

  // Load pinned websites from storage on mount
  useEffect(() => {
    const load_pinned_websites = async () => {
      try {
        // Get pinned URLs from localStorage
        const stored = localStorage.getItem(PINNED_WEBSITES_KEY)
        const pinnedUrls = stored
          ? (JSON.parse(stored) as StoredPinnedUrls).urls
          : []

        const websites: PinnedWebsite[] = []

        // Load website data for each pinned URL from localforage
        for (const url of pinnedUrls) {
          const stored = await websites_store.getItem<StoredPinnedWebsite>(url)
          if (stored) {
            websites.push({
              url: stored.url,
              title: stored.title,
              plain_text: stored.plain_text,
              is_enabled: stored.is_enabled ?? true, // Use stored value or default to true
            })
          }
        }

        set_pinned_websites(websites)
      } catch (error) {
        console.error('Error loading pinned websites:', error)
      }
    }

    load_pinned_websites()
  }, [])

  const pin_website = async (website: PinnedWebsite) => {
    try {
      // Store website data in localforage
      const stored_website: StoredPinnedWebsite = {
        url: website.url,
        title: website.title,
        plain_text: website.plain_text,
        pinned_at: Date.now(),
        is_enabled: website.is_enabled, // Store the enabled state
      }
      await websites_store.setItem(website.url, stored_website)

      // Update pinned URLs in localStorage
      const stored = localStorage.getItem(PINNED_WEBSITES_KEY)
      const pinned_urls = stored
        ? (JSON.parse(stored) as StoredPinnedUrls).urls
        : []
      if (!pinned_urls.includes(website.url)) {
        pinned_urls.push(website.url)
        localStorage.setItem(
          PINNED_WEBSITES_KEY,
          JSON.stringify({ urls: pinned_urls }),
        )
      }

      // Update state
      const pinned_website: PinnedWebsite = {
        ...website,
      }
      set_pinned_websites([...pinned_websites, pinned_website])
    } catch (error) {
      console.error('Error pinning website:', error)
    }
  }

  const unpin_website = async (url: string) => {
    try {
      // Remove URL from localStorage only
      const stored = localStorage.getItem(PINNED_WEBSITES_KEY)
      if (stored) {
        const pinned_urls = (
          JSON.parse(stored) as StoredPinnedUrls
        ).urls.filter((storedUrl) => storedUrl !== url)
        localStorage.setItem(
          PINNED_WEBSITES_KEY,
          JSON.stringify({ urls: pinned_urls }),
        )
      }

      // Remove from state
      const updated_pinned_websites = pinned_websites.filter(
        (website) => website.url != url,
      )
      set_pinned_websites(updated_pinned_websites)

      // Website data remains in localforage for future use
    } catch (error) {
      console.error('Error unpinning website:', error)
    }
  }

  const toggle_is_enabled = async (url: string) => {
    try {
      const updated_pinned_websites = pinned_websites.map((website) => {
        if (website.url == url) {
          return { ...website, is_enabled: !website.is_enabled }
        }
        return website
      })
      set_pinned_websites(updated_pinned_websites)

      // Update the enabled state in storage
      const website = updated_pinned_websites.find((w) => w.url === url)
      if (website) {
        const stored = await websites_store.getItem<StoredPinnedWebsite>(url)
        if (stored) {
          stored.is_enabled = website.is_enabled
          await websites_store.setItem(url, stored)
        }
      }
    } catch (error) {
      console.error('Error toggling website enabled state:', error)
    }
  }

  return {
    pinned_websites,
    pin_website,
    unpin_website,
    toggle_is_enabled,
  }
}
