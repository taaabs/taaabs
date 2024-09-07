import { get_auth_data } from '@/helpers/get-auth-data'
import { SHA256 } from '@repositories/utils/sha256'
import { get_ky_instance } from './api/get-ky-instance'
import { CheckUrlSaved_Dto } from '@shared/types/modules/bookmarks/check-url-saved.dto'

export async function get_url_is_saved(url: string): Promise<boolean> {
  try {
    const auth_data = await get_auth_data()
    if (!auth_data) {
      console.error('[get_url_is_saved] Auth data is missing.')
      return false
    }

    const ky_instance = get_ky_instance()
    const url_hash = await SHA256(url, new Uint8Array(auth_data.encryption_key))
    const body: CheckUrlSaved_Dto.Body = {
      url_hash,
    }
    const response = await ky_instance
      .post(`v1/bookmarks/check-url-saved`, {
        json: body,
      })
      .json<CheckUrlSaved_Dto.Response>()

    if (response.is_saved) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('[get_url_is_saved] Failed to check URL status.')
    return false
  }
}
