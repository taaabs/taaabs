import localforage from 'localforage'

export type StoredWebsite = {
  url: string
  title: string
  plain_text: string
}

export type Website = {
  url: string
  title: string
  plain_text: string
}

// Initialize localforage instance for website data
const STORE_NAME = 'websites'
export const websites_store = localforage.createInstance({
  name: 'taaabs',
  storeName: STORE_NAME,
})

export const use_websites_store = () => {
  const store_website = async (website: Website) => {
    try {
      const stored_website: StoredWebsite = {
        url: website.url,
        title: website.title,
        plain_text: website.plain_text,
      }
      await websites_store.setItem(website.url, stored_website)
    } catch (error) {
      console.error('Error storing website:', error)
    }
  }

  const get_website = async (url: string): Promise<Website | null> => {
    try {
      const stored = await websites_store.getItem<StoredWebsite>(url)
      if (stored) {
        return {
          url: stored.url,
          title: stored.title,
          plain_text: stored.plain_text,
        }
      }
      return null
    } catch (error) {
      console.error('Error getting website:', error)
      return null
    }
  }

  return {
    store_website,
    get_website,
  }
}
