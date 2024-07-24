import { AuthContext } from '@/app/auth-provider'
import { browser_storage } from '@/constants/browser-storage'
import { use_library_dispatch, use_library_selector } from '@/stores/library'
import { pinned_actions } from '@repositories/stores/library/pinned/pinned.slice'
import { use_is_hydrated } from '@shared/hooks'
import useUpdateEffect from 'beautiful-react-hooks/useUpdateEffect'
import { useParams } from 'next/navigation'
import { useContext } from 'react'

export const use_pinned = () => {
  const auth_context = useContext(AuthContext)
  const is_hydrated = use_is_hydrated()
  const { username }: { username?: string } = useParams()
  const dispatch = use_library_dispatch()
  const {
    is_fetching,
    is_updating,
    items,
    fetched_at_timestamp,
    should_refetch,
  } = use_library_selector((state) => state.pinned)

  const get_pinned = async () => {
    if (!username) {
      dispatch(
        pinned_actions.get_pinned_authorized({
          ky: auth_context.ky_instance,
          encryption_key: auth_context.auth_data!.encryption_key,
        }),
      )
    } else {
      dispatch(
        pinned_actions.get_pinned_public({
          ky: auth_context.ky_instance,
          get_pinned_params: {
            username,
          },
        }),
      )
    }
  }

  useUpdateEffect(() => {
    sessionStorage.setItem(
      browser_storage.session_storage.library.pinned({
        username,
      }),
      JSON.stringify(items || []),
    )
  }, [items])

  useUpdateEffect(() => {
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
  }, [is_hydrated])

  return {
    get_pinned,
    fetched_at_timestamp,
    is_fetching,
    is_updating,
    items,
    should_refetch,
  }
}
