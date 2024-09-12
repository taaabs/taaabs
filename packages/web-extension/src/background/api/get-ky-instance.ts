import { get_auth_data } from '@/helpers/get-auth-data'
import ky from 'ky'

let ky_instance: typeof ky | null = null

export const get_ky_instance = () => {
  if (!ky_instance) {
    ky_instance = ky.create({
      prefixUrl: 'https://api.taaabs.com/',
      retry: {
        limit: 20,
        methods: ['get', 'post', 'put', 'patch', 'delete'],
        backoffLimit: 1000,
        statusCodes: [401, 429, 502],
      },
      hooks: {
        beforeRequest: [
          async (request) => {
            const auth_data = await get_auth_data()
            if (auth_data) {
              request.headers.set(
                'Authorization',
                `Bearer ${auth_data.access_token}`,
              )
            }
          },
        ],
        afterResponse: [
          async (request, __, response) => {
            if (response.status == 401) {
              const auth_data = await get_auth_data()

              if (auth_data) {
                const response = await fetch(
                  'https://api.taaabs.com/v1/auth/refresh',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      access_token: auth_data.access_token,
                      refresh_token: auth_data.refresh_token,
                    }),
                  },
                )

                if (!response.ok) {
                  console.error(
                    '[refresh_auth_tokens] Failed to refresh token:',
                    response.status,
                    await response.text(),
                  )
                  return
                }

                const refreshed_auth_data = await response.json()

                const new_auth_data = {
                  ...auth_data,
                  access_token: refreshed_auth_data.access_token,
                  refresh_token: refreshed_auth_data.refresh_token,
                }

                chrome.storage.local.set(
                  {
                    auth_data: new_auth_data,
                  },
                  () => {
                    console.debug('New auth data has been saved:', new_auth_data)
                  },
                )

                request.headers.set(
                  'Authorization',
                  `Bearer ${new_auth_data.access_token}`,
                )

                ky_instance!(request)
              }
            }
          },
        ],
      },
    })
  }
  return ky_instance
}
