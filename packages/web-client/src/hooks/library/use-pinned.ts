import { browser_storage } from '@/constants/browser-storage'
import { use_library_dispatch, use_library_selector } from '@/stores/library'
import { pinned_actions } from '@repositories/stores/library/pinned/pinned.slice'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import ky from 'ky'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export const use_pinned = () => {
  const { username }: { username?: string } = useParams()
  const dispatch = use_library_dispatch()
  const { is_fetching, is_updating, items, fetched_at_timestamp } =
    use_library_selector((state) => state.pinned)

  const get_pinned = async () => {
    const ky_instance = ky.create({
      prefixUrl: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhQmNEZSIsImlhdCI6MTcxMDM1MjExNn0.ZtpENZ0tMnJuGiOM-ttrTs5pezRH-JX4_vqWDKYDPWY`,
        'Content-Type': 'application/json',
      },
    })
    if (!username) {
      dispatch(pinned_actions.get_pinned_authorized({ ky: ky_instance }))
    } else {
      dispatch(
        pinned_actions.get_pinned_public({
          ky: ky_instance,
          get_pinned_params: {
            username,
          },
        }),
      )
    }
  }

  useUpdateEffect(() => {
    if (items) {
      sessionStorage.setItem(
        browser_storage.session_storage.library.pinned({
          username,
        }),
        JSON.stringify(items),
      )
    }
  }, [items])

  useEffect(() => {
    const pinned_items = sessionStorage.getItem(
      browser_storage.session_storage.library.pinned({
        username,
      }),
    )
    if (pinned_items) {
      dispatch(pinned_actions.set_items(JSON.parse(pinned_items)))
      dispatch(pinned_actions.set_fetched_at_timestamp(Date.now()))
    } else {
      get_pinned()
    }
  }, [])

  return {
    get_pinned,
    fetched_at_timestamp,
    is_fetching,
    is_updating,
    items,
  }
}
