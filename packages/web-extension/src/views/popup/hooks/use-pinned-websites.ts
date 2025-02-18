import { useState } from 'react'
import localforage from 'localforage'

export interface StoredPinnedWebsite {
  url: string
  title: string
  plain_text: string
  pinned_at: number
}

export interface PinnedWebsiteStore {
  [url: string]: StoredPinnedWebsite
}

// Initialize localforage instance for pinned websites
const STORE_NAME = 'pinned-websites'
const pinned_websites_store = localforage.createInstance({
  name: 'taaabs',
  storeName: STORE_NAME,
})

type PinnedWebsite = {
  url: string
  title: string
  plain_text: string
  is_enabled: boolean
}

export const use_pinned_websites = () => {
  const [pinned_websites, set_pinned_websites] = useState<PinnedWebsite[]>([])

  const pin_website = async (website: PinnedWebsite) => {
    const stored_pinned_website: StoredPinnedWebsite = {
      url: website.url,
      title: website.title,
      plain_text: website.plain_text,
      pinned_at: Date.now(),
    }
    pinned_websites_store.setItem(website.url, stored_pinned_website)

    const pinned_website: PinnedWebsite = {
      ...website,
    }

    set_pinned_websites([...pinned_websites, pinned_website])
  }

  const unpin_website = async (url: string) => {
    const updated_pinned_websites = pinned_websites.filter(
      (website) => website.url != url,
    )
    set_pinned_websites(updated_pinned_websites)
  }

  const toggle_is_enabled = (url: string) => {
    const updated_pinned_websites = pinned_websites.map((website) => {
      if (website.url == url) {
        return { ...website, is_enabled: !website.is_enabled }
      }
      return website
    })
    set_pinned_websites(updated_pinned_websites)
  }

  return {
    pinned_websites,
    pin_website,
    unpin_website,
    toggle_is_enabled,
  }
}
