export async function check_url_status(url) {
  try {
    const auth_data = await get_auth_data()
    if (!auth_data) {
      console.error('Authentication data is missing.')
      return false
    }

    const hash = await derive_hash_from_url(url, auth_data.encryption_key)
    const response = await fetch(
      'https://api.taaabs.com/v1/bookmarks/find-by-url-hash',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth_data.access_token}`,
        },
        body: JSON.stringify({ hash }),
      },
    )

    if (response.status == 201) {
      return true
    } else {
      console.error(
        'Failed to check URL status:',
        response.status,
        await response.text(),
      )
      return false
    }
  } catch (error) {
    console.error('Error checking URL status:', error)
    return false
  }
}

async function get_auth_data() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['auth_data'], function (result) {
      resolve(result.auth_data)
      console.log('Auth data:', result.auth_data)
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
