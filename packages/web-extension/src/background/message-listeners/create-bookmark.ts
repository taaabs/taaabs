import { get_auth_data } from '@/helpers/get-auth-data'
import ky from 'ky'

export const create_bookmark = () => {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action == 'create-bookmark') {
      ;(async () => {
        const auth_data = await get_auth_data()
        const ky_instance = ky.create({
          prefixUrl: 'https://api.taaabs.com/',
          headers: {
            Authorization: `Bearer ${auth_data.access_token}`,
          },
        })

        const created_bookmark = await ky_instance
          .post('v1/bookmarks', {
            json: request.data,
          })
          .json()

        console.log('Bookmark has been created!', created_bookmark)

        sendResponse(created_bookmark)
      })()
      return true
    }
    return false
  })
}
