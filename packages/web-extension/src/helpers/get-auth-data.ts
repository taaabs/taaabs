export const get_auth_data = async (): Promise<{
  access_token: string
  refresh_token: string
  encryption_key: Uint8Array
}> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['auth_data'], (result) => {
      resolve({
        ...result.auth_data,
        encryption_key: new Uint8Array(result.auth_data.encryption_key),
      })
    })
  })
}
