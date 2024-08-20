async function refresh_auth_tokens() {
  const auth_data = await get_auth_data()
  if (!auth_data) {
    console.log('[refresh_auth_tokens] Authentication data is missing.')
    return null
  }

  const response = await fetch('https://api.taaabs.com/v1/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: auth_data.access_token,
      refresh_token: auth_data.refresh_token,
    }),
  })

  if (!response.ok) {
    console.log(
      '[refresh_auth_tokens] Failed to refresh token:',
      response.status,
      await response.text(),
    )
    return null
  }

  const new_auth_data = await response.json();
  const current_auth_data = await get_auth_data();
  chrome.storage.local.set(
    {
      auth_data: {
        ...current_auth_data,
        access_token: new_auth_data.access_token,
        refresh_token: new_auth_data.refresh_token,
      },
    },
    () => {
      console.log('[refresh_auth_tokens] New auth data saved:', new_auth_data)
    },
  )

  return new_auth_data.access_token
}

export async function check_url_status(url: string): Promise<boolean> {
  let retries = 0
  const max_retries = 3

  while (retries < max_retries) {
    try {
      const auth_data = await get_auth_data()
      if (!auth_data) {
        console.log('[check_url_status] Auth data is missing.')
        return false
      }

      const hash = await derive_hash_from_url(url, auth_data.encryption_key)
      const response = await fetch(
        `https://api.taaabs.com/v1/bookmarks/find-by-url-hash/${hash}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth_data.access_token}`,
          },
        },
      )

      if (response.status == 401) {
        const new_access_token = await refresh_auth_tokens()
        if (!new_access_token) {
          console.log('[check_url_status] Failed to refresh token, aborting.')
          return false
        }
        continue
      }

      if (response.status == 200) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log('[check_url_status] Failed to check URL status.')
      return false
    } finally {
      retries++
    }
  }

  console.log('[check_url_status] Max retries reached, aborting.')
  return false
}

async function get_auth_data(): Promise<any> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['auth_data'], (result) => {
      resolve(result.auth_data)
    })
  })
}

async function derive_hash_from_url(
  url: string,
  encryption_key: Uint8Array,
): Promise<string> {
  return SHA256(url, encryption_key)
}

export const SHA256 = async (
  data: string,
  encryption_key: Uint8Array,
): Promise<string> => {
  const encoder = new TextEncoder()
  const encoded_data = encoder.encode(data)
  const merged_array = new Uint8Array(
    encoded_data.length + encryption_key.length,
  )
  merged_array.set(encoded_data)
  merged_array.set(encryption_key, encoded_data.length)
  const hash = await crypto.subtle.digest('SHA-256', merged_array)
  const hash_hex = [...new Uint8Array(hash)]
    .map((char) => char.toString(16).padStart(2, '0'))
    .join('')
  return hash_hex
}
