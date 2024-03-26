import { use_library_dispatch, use_library_selector } from '@/stores/library'
import { pinned_actions } from '@repositories/stores/library/pinned/pinned.slice'
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
      await dispatch(pinned_actions.get_pinned_authorized({ ky: ky_instance }))
    }
  }

  const reload_pinned = async (bookmark_id: number) => {
    if (items?.find((item) => item.bookmark_id == bookmark_id)) {
      await get_pinned()
    }
  }

  useEffect(() => {
    get_pinned()
  }, [])

  return {
    get_pinned,
    reload_pinned,
    fetched_at_timestamp,
    is_fetching,
    is_updating,
    items,
  }
}
