import { get_auth_data } from '@/helpers/get-auth-data'
import { SHA256 } from '@repositories/utils/sha256'
import { create_ky_instance } from './api/ky-instance'

export async function get_is_url_saved(url: string): Promise<boolean> {
  try {
    const auth_data = await get_auth_data()
    if (!auth_data) {
      console.log('[check_url_status] Auth data is missing.')
      return false
    }

    const ky_instance = create_ky_instance()
    const hash = await SHA256(url, new Uint8Array(auth_data.encryption_key))
    const response = await ky_instance
      .get(`v1/bookmarks/find-by-url-hash/${hash}`)
      .json()

    if (response) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log('[check_url_status] Failed to check URL status.')
    return false
  }
}

// const refresh_auth_tokens = async (
//   auth_data: any,
// ): Promise<string | null> => {
//   const response = await fetch('https://api.taaabs.com/v1/auth/refresh', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       access_token: auth_data.access_token,
//       refresh_token: auth_data.refresh_token,
//     }),
//   })

//   if (!response.ok) {
//     console.log(
//       '[refresh_auth_tokens] Failed to refresh token:',
//       response.status,
//       await response.text(),
//     )
//     return null
//   }

//   const refreshed_auth_data = await response.json()
//   const new_auth_data = {
//     ...auth_data,
//     access_token: refreshed_auth_data.access_token,
//     refresh_token: refreshed_auth_data.refresh_token,
//   }

//   chrome.storage.local.set(
//     {
//       auth_data: new_auth_data,
//     },
//     () => {
//       console.log('[refresh_auth_tokens] New auth data saved:', new_auth_data)
//     },
//   )

//   console.log('new access token',new_auth_data.access_token)

//   return new_auth_data.access_token
// }
