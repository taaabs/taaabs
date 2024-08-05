async function refresh_auth_tokens() {
  const auth_data = await get_auth_data()
  if (!auth_data) {
    console.error('Authentication data is missing.')
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
    console.error(
      'Failed to refresh token:',
      response.status,
      await response.text(),
    )
    return null
  }

  const new_auth_data = await response.json()
  const current_auth_data = await get_auth_data()
  chrome.storage.local.set(
    {
      auth_data: {
        ...current_auth_data,
        access_token: new_auth_data.access_token,
        refresh_token: new_auth_data.refresh_token,
      },
    },
    () => {
      console.log('New auth data saved:', new_auth_data)
    },
  )

  return new_auth_data.access_token
}

export async function check_url_status(url) {
  let retries = 0
  const max_retries = 3

  while (retries < max_retries) {
    try {
      const auth_data = await get_auth_data()
      if (!auth_data) {
        console.log('Auth data is missing.')
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
          console.error('Failed to refresh token, aborting.')
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
      console.error('Error checking URL status:', error)
      return false
    } finally {
      retries++
    }
  }

  console.error('Max retries reached, aborting.')
  return false
}

async function get_auth_data() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['auth_data'], function (result) {
      resolve(result.auth_data)
    })
  })
}

async function derive_hash_from_url(url, encryption_key) {
  return SHA256(url, encryption_key)
}

export const SHA256 = async (data, encryption_key) => {
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
