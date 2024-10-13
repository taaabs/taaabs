import { useState } from 'react'
import { get_ky_instance } from '@/background/api/get-ky-instance'
import { get_auth_data } from '@/helpers/get-auth-data'
import { SHA256 } from '@repositories/utils/sha256'
import browser from 'webextension-polyfill'

export const use_delete_bookmark = (params: {
  current_url: string
  set_is_saved: (is_saved: boolean) => void
}) => {
  const [is_deleting, set_is_deleting] = useState<boolean>()

  const delete_bookmark = async () => {
    set_is_deleting(true)
    const ky_instance = get_ky_instance()
    const auth_data = await get_auth_data()

    const url_hash = await SHA256(
      params.current_url,
      new Uint8Array(auth_data.encryption_key),
    )

    await ky_instance
      .delete(`v1/bookmarks/delete-by-url-hash/${url_hash}`)
      .json()

    set_is_deleting(false)

    params.set_is_saved(false)
  }

  return { delete_bookmark, is_deleting, set_is_deleting }
}
